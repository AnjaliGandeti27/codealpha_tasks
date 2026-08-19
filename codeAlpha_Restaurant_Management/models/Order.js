const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },

    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: [true, "Menu item ID is required"]
    },

    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: false
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"]
    },

    status: {
      type: String,
      enum: {
        values: ["Preparing", "Served", "Cancelled"],
        message: "Status must be Preparing, Served, or Cancelled"
      },
      default: "Preparing"
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;