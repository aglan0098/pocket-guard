const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  percentage: Number,
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  monthlyIncome: { type: Number, default: 0 },
  items: [ItemSchema],
});

module.exports = mongoose.model("User", UserSchema);
