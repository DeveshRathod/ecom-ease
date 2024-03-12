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
      email: user.email,
      profile: user.profile,
      isAdmin: user.isAdmin,
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
  const { username, email, password, confirmPassword } = req.body;

  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const exists = await User.findOne({ email: email });

  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 8);
  try {
    const user = new User({
      username: username,
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
      email: user.email,
      profile: user.profile,
      isAdmin: user.isAdmin,
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
      email: user.email,
      profile: user.profile,
      isAdmin: user.isAdmin,
    };

    return res.status(200).json({ token: token, currentUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  let userData = req.body;
  const userId = req.user._id;

  try {
    if (userData.email) {
      if (!isValidEmail(userData.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
    }

    if (userData.username) {
      if (!isValidUsername(userData.username)) {
        return res.status(400).json({ message: "Invalid username format" });
      }
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

    userData = {
      ...(userData.username && { username: userData.username }),
      ...(userData.email && { email: userData.email }),
      ...(userData.password && { password: userData.password }),
      ...(userData.profile && { profile: userData.profile }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profile: updatedUser.profile,
      isAdmin: updatedUser.isAdmin,
    };

    console.log(currentUser);

    return res.status(200).json(currentUser);
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
  const { addressLine1, addressLine2, addressLine3, pincode } = req.body;
  const userId = req.user._id;

  if (!addressLine1 || !addressLine2 || !addressLine3 || !pincode) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const newAddress = await Address.create({
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

export const addWishlist = (req, res) => {};

export const deleteWishlist = (req, res) => {};

export const addCart = (req, res) => {};

export const deleteCart = (req, res) => {};
