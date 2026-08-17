const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: [true, "Menu item ID is required"],
      unique: true
    },

    quantityAvailable: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be negative"]
    }
  },
  {
    timestamps: true
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;