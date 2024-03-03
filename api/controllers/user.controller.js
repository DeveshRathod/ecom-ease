import User from "../database/models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const me = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
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

    user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    return res.status(201).json({ token: token, user });
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
    let user;
    if (email) {
      user = await User.findOne({ email: email });
    } else if (username) {
      user = await User.findOne({ username: username });
    }

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

    return res.status(200).json({ token: token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
