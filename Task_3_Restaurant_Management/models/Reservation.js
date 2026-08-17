const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "Table ID is required"]
    },

    reservationDate: {
      type: String,
      required: [true, "Reservation date is required"],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Reservation date must be in YYYY-MM-DD format"
      ]
    },

    reservationTime: {
      type: String,
      required: [true, "Reservation time is required"],
      match: [
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Reservation time must be in HH:MM format"
      ]
    },

    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Number of guests must be at least 1"]
    },

    status: {
      type: String,
      enum: {
        values: ["Reserved", "Cancelled"],
        message: "Status must be Reserved or Cancelled"
      },
      default: "Reserved"
    }
  },
  {
    timestamps: true
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;