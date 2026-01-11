const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, collegeName } = req.body;
  console.log("Registering user...");
  console.log(req.body);

  // 1. Check for all fields
  if (!name || !email || !password || !collegeName) {
    // FIX: Send JSON immediately, don't throw
    return res.status(400).json({ message: "Please add all fields" });
  }

  // 2. Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    // FIX: Send JSON immediately, don't throw
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    collegeName,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      collegeName: user.collegeName,
      avatar: user.avatar,
      reputationScore: user.reputationScore,
      isVerified: user.isVerified,
      savedItems: user.savedItems,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      collegeName: user.collegeName,
      avatar: user.avatar,
      reputationScore: user.reputationScore,
      isVerified: user.isVerified,
      savedItems: user.savedItems,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
