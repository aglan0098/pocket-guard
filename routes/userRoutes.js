const express = require("express");
const router = express.Router();
const {
  getUserData,
  registerUser,
  loginUser,
  updateMonthlyIncome,
  addItem,
  deleteItem,
} = require("../controllers/userController");

// Get user data (income and items)
router.get("/:userId", getUserData);

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Update monthly income
router.put("/income", updateMonthlyIncome);

// Add budget item
router.post("/item", addItem);

// Delete budget item
router.delete("/item", deleteItem);

module.exports = router;
