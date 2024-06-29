import User from "../database/models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Address } from "../database/models/address.model.js";
import Order from "../database/models/order.model.js";
import { v4 as uuidv4 } from "uuid";

const generateNotification = (message, sender) => {
  return {
    message,
    sender,
    date: new Date(),
    notificationId: uuidv4(),
    status: "Unread",
  };
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{3,15}$/;
  return usernameRegex.test(username);
}

export const me = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const currentUser = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      mobile: user.mobile,
      profile: user.profile,
      isAdmin: user.isAdmin,
      background: user.background,
      createdAt: user.createdAt,
    };
    res.status(200).json({ currentUser });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const exists = await User.findOne({ email: email });

  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 8);
  try {
    const user = new User({
      firstName: firstName,
      lastName: lastName,

      email: email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    const currentUser = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      mobile: user.mobile,
      profile: user.profile,
      isAdmin: user.isAdmin,
      background: user.background,
      createdAt: user.createdAt,
    };

    return res.status(201).json({ token: token, currentUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    const currentUser = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      mobile: user.mobile,
      profile: user.profile,
      isAdmin: user.isAdmin,
      background: user.background,
      createdAt: user.createdAt,
    };

    return res.status(200).json({ token: token, currentUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user._id;
  const userData = req.body;

  try {
    if (userData.email && !isValidEmail(userData.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (userData.username && !isValidUsername(userData.username)) {
      return res.status(400).json({ message: "Invalid username format" });
    }

    if (userData.password) {
      if (userData.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be 8 characters long" });
      }
      if (userData.confirmPassword !== userData.password) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
    }

    if (userData.password) {
      userData.password = await bcryptjs.hash(userData.password, 8);
    }

    const updateFields = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      background: userData.background,
      username: userData.username,
      email: userData.email,
      birthday: userData.birthday,
      gender: userData.gender,
      mobile: userData.mobile,
      profile: userData.profile,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === undefined ||
          updateFields[key] === "" ||
          updateFields[key] === null) &&
        delete updateFields[key]
    );

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAddress = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIds = user.address;

    const addresses = await Address.find({ _id: { $in: addressIds } });

    return res.status(200).json(addresses);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addAddress = async (req, res) => {
  const {
    type,
    name,
    mobile,
    addressLine1,
    addressLine2,
    addressLine3,
    pincode,
  } = req.body;
  const userId = req.user._id;

  if (
    !addressLine1 ||
    !addressLine2 ||
    !addressLine3 ||
    !pincode ||
    !type ||
    !name ||
    !mobile
  ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const newAddress = await Address.create({
      type,
      name,
      mobile,
      addressLine1,
      addressLine2,
      addressLine3,
      pincode,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { address: newAddress._id.toString() },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Address Added", address: newAddress });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAddress = async (req, res) => {
  const addressId = req.body.addressId;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressExists = user.address.includes(addressId);

    if (!addressExists) {
      return res
        .status(404)
        .json({ message: "Address not found in user's address list" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { address: addressId } },
      { new: true }
    );

    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address document not found" });
    }

    return res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  const userId = req.user._id;
  const { date } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "userId query parameter is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let orders = await Order.find({ _id: { $in: user.orders } });

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      orders = orders.filter(
        (order) => order.createdAt >= startDate && order.createdAt <= endDate
      );
    }

    // Sort orders by createdAt in descending order (newest first)
    orders.sort((a, b) => b.createdAt - a.createdAt);

    // Populate address details for each order
    await Order.populate(orders, { path: "address", model: Address });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId, transactionId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = user.orders.find((order) => order._id.toString() === orderId);

    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found in user's orders list" });
    }

    const orderInDb = await Order.findById(orderId);
    if (!orderInDb) {
      return res.status(404).json({ error: "Order not found in the database" });
    }
    orderInDb.status = "Requested cancellation";
    await orderInDb.save();

    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      return res.status(404).json({ error: "Admin user not found" });
    }

    const adminMessage = `A cancellation request has been submitted for Order ID: ${orderId}, Transaction ID: ${transactionId}. Please review and process the request accordingly.`;
    const adminNotification = generateNotification(adminMessage, userId);

    adminUser.notifications.push(adminNotification);
    await adminUser.save();

    const userMessage = `Dear Customer, your cancellation request for Order ID: ${orderId} has been successfully submitted. If the payment has already been made, the refund process will be initiated shortly. Thank you for shopping with us.`;
    const userNotification = generateNotification(userMessage, "System");

    user.notifications.push(userNotification);

    await user.save();

    res.status(200).json({
      message:
        "Order cancellation requested and notifications sent to both admin and user",
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while canceling the order" });
  }
};

export const getNotifications = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sortedNotifications = user.notifications.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const unreadCount = sortedNotifications.filter(
      (notification) => notification.status === "Unread"
    ).length;

    res.status(200).json({
      notifications: sortedNotifications,
      unreadCount: unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.notifications = user.notifications.map((notification) => ({
      ...notification,
      status: "Read",
    }));

    await user.save();

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  const userId = req.user._id;
  const { notificationIds } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.notifications = user.notifications.filter((notification) => {
      return !notificationIds.includes(notification.notificationId);
    });

    await user.save();

    res.status(200).json(user.notifications);
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
