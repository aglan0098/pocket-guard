const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add or update monthly income
exports.updateMonthlyIncome = async (req, res) => {
  const { userId, income } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { monthlyIncome: income },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a budget item
exports.addItem = async (req, res) => {
  const { userId, name, percentage } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.items.push({ name, percentage });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a budget item
exports.deleteItem = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.items = user.items.filter((item) => item._id.toString() !== itemId);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user data
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const itemsWithAmount = user.items.map((item) => ({
      ...item._doc,
      amount: (user.monthlyIncome * item.percentage) / 100,
    }));

    res.json({
      monthlyIncome: user.monthlyIncome,
      items: itemsWithAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
