import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });

export async function registerUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({
      success: false,
      message: "Invalid email.",
    });
  }
  if (password.length < 8) {
    res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters.",
    });
  }

  try {
    if (await User.findOne({ email })) {
      res.status(409).json({
        success: false,
        message: "User already exist.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}
