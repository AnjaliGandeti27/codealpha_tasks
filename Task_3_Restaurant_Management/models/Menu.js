const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true
    },

    price: {
      type: Number,
      required: [true, "Menu item price is required"],
      min: [0, "Price cannot be negative"]
    },

    category: {
      type: String,
      required: [true, "Menu item category is required"],
      enum: {
        values: ["Veg", "Non-Veg", "Drinks", "Desserts"],
        message: "Category must be Veg, Non-Veg, Drinks, or Desserts"
      }
    },

    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;