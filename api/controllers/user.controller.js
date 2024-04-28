import User from "../database/models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import Address from "../database/models/address.model.js";

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

    return res.status(200).json({ message: "Address Added" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAddress = async (req, res) => {
  const addressId = req.body.addressId;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { address: addressId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Address Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


