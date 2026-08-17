const express = require("express");
const mongoose = require("mongoose");

const Menu = require("./models/Menu");
const Order = require("./models/Order");
const Table = require("./models/Table");
const Reservation = require("./models/Reservation");
const Inventory = require("./models/Inventory");

const app = express();
const PORT = 3000;

app.use(express.json());

const MONGO_URI = "mongodb://localhost:27017/restaurantmanagement";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Restaurant Management System API"
  });
});

// ===============================
// MENU APIs
// ===============================

app.post("/menu", async (req, res) => {
  try {
    const menuItem = new Menu(req.body);
    const savedMenuItem = await menuItem.save();

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem: savedMenuItem
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add menu item",
      error: error.message
    });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const menuItems = await Menu.find();

    res.status(200).json({
      message: "Menu items retrieved successfully",
      menuItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve menu items",
      error: error.message
    });
  }
});

app.get("/menu/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    res.status(200).json({
      message: "Menu item retrieved successfully",
      menuItem
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid menu item ID",
      error: error.message
    });
  }
});

app.delete("/menu/:id", async (req, res) => {
  try {
    const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    await Inventory.findOneAndDelete({
      menuItem: req.params.id
    });

    res.status(200).json({
      message: "Menu item deleted successfully",
      menuItem: deletedMenuItem
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid menu item ID",
      error: error.message
    });
  }
});

// ===============================
// ORDER APIs
// ===============================

app.post("/orders", async (req, res) => {
  try {
    const { customerName, menuItem, reservation, quantity } = req.body;

    if (!customerName || !menuItem || quantity === undefined) {
      return res.status(400).json({
        message: "Customer name, menu item ID, and quantity are required"
      });
    }

    const existingMenuItem = await Menu.findById(menuItem);

    if (!existingMenuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    if (!existingMenuItem.available) {
      return res.status(400).json({
        message: "Menu item is currently unavailable"
      });
    }

    if (reservation) {
      const existingReservation = await Reservation.findById(reservation);

      if (!existingReservation) {
        return res.status(404).json({
          message: "Reservation not found"
        });
      }

      if (existingReservation.status !== "Reserved") {
        return res.status(400).json({
          message: "Order cannot be linked to a cancelled reservation"
        });
      }
    }

    const existingInventory = await Inventory.findOne({
      menuItem
    });

    if (!existingInventory) {
      return res.status(404).json({
        message: "Inventory record not found for this menu item"
      });
    }

    if (existingInventory.quantityAvailable < quantity) {
      return res.status(400).json({
        message: "Insufficient inventory for this menu item",
        availableQuantity: existingInventory.quantityAvailable
      });
    }

    const totalPrice = existingMenuItem.price * quantity;

    const order = new Order({
      customerName,
      menuItem,
      reservation,
      quantity,
      totalPrice
    });

    const savedOrder = await order.save();

    existingInventory.quantityAvailable -= quantity;
    await existingInventory.save();

    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("menuItem")
      .populate({
        path: "reservation",
        populate: {
          path: "table"
        }
      });

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
      remainingInventory: existingInventory.quantityAvailable
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create order",
      error: error.message
    });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("menuItem")
      .populate({
        path: "reservation",
        populate: {
          path: "table"
        }
      });

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Preparing", "Served", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Preparing, Served, or Cancelled"
      });
    }

    const existingOrder = await Order.findById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (status === "Cancelled" && existingOrder.status !== "Cancelled") {
      const existingInventory = await Inventory.findOne({
        menuItem: existingOrder.menuItem
      });

      if (!existingInventory) {
        return res.status(404).json({
          message: "Inventory record not found for this menu item"
        });
      }

      existingInventory.quantityAvailable += existingOrder.quantity;
      await existingInventory.save();

      if (existingOrder.reservation) {
        const linkedReservation = await Reservation.findById(
          existingOrder.reservation
        );

        if (linkedReservation && linkedReservation.status === "Reserved") {
          linkedReservation.status = "Cancelled";
          await linkedReservation.save();
        }
      }
    }

    existingOrder.status = status;
    const updatedOrder = await existingOrder.save();

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate("menuItem")
      .populate({
        path: "reservation",
        populate: {
          path: "table"
        }
      });

    res.status(200).json({
      message: "Order status updated successfully",
      order: populatedOrder
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
});

// ===============================
// TABLE APIs
// ===============================

app.post("/tables", async (req, res) => {
  try {
    const table = new Table(req.body);
    const savedTable = await table.save();

    res.status(201).json({
      message: "Table created successfully",
      table: savedTable
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create table",
      error: error.message
    });
  }
});

app.get("/tables", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });

    res.status(200).json({
      message: "Tables retrieved successfully",
      tables
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve tables",
      error: error.message
    });
  }
});

// ===============================
// RESERVATION APIs
// ===============================

app.post("/reservations", async (req, res) => {
  try {
    const {
      customerName,
      table,
      reservationDate,
      reservationTime,
      guests
    } = req.body;

    const existingTable = await Table.findById(table);

    if (!existingTable) {
      return res.status(404).json({
        message: "Table not found"
      });
    }

    if (guests > existingTable.capacity) {
      return res.status(400).json({
        message: "Number of guests exceeds table capacity",
        tableCapacity: existingTable.capacity
      });
    }

    const existingReservation = await Reservation.findOne({
      table,
      reservationDate,
      reservationTime,
      status: "Reserved"
    });

    if (existingReservation) {
      return res.status(400).json({
        message: "Table is already reserved for this date and time"
      });
    }

    const reservation = new Reservation({
      customerName,
      table,
      reservationDate,
      reservationTime,
      guests
    });

    const savedReservation = await reservation.save();

    const populatedReservation = await Reservation.findById(
      savedReservation._id
    ).populate("table");

    res.status(201).json({
      message: "Table reserved successfully",
      reservation: populatedReservation
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create reservation",
      error: error.message
    });
  }
});

app.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("table")
      .sort({ reservationDate: 1, reservationTime: 1 });

    res.status(200).json({
      message: "Reservations retrieved successfully",
      reservations
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve reservations",
      error: error.message
    });
  }
});

app.put("/reservations/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    ).populate("table");

    if (!updatedReservation) {
      return res.status(404).json({
        message: "Reservation not found"
      });
    }

    res.status(200).json({
      message: "Reservation status updated successfully",
      reservation: updatedReservation
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update reservation status",
      error: error.message
    });
  }
});

// ===============================
// INVENTORY APIs
// ===============================

app.post("/inventory", async (req, res) => {
  try {
    const { menuItem, quantityAvailable } = req.body;

    const existingMenuItem = await Menu.findById(menuItem);

    if (!existingMenuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    const existingInventory = await Inventory.findOne({
      menuItem
    });

    if (existingInventory) {
      return res.status(400).json({
        message: "Inventory record already exists for this menu item"
      });
    }

    const inventory = new Inventory({
      menuItem,
      quantityAvailable
    });

    const savedInventory = await inventory.save();

    const populatedInventory = await Inventory.findById(
      savedInventory._id
    ).populate("menuItem");

    res.status(201).json({
      message: "Inventory record created successfully",
      inventory: populatedInventory
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create inventory record",
      error: error.message
    });
  }
});

app.get("/inventory", async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("menuItem");

    res.status(200).json({
      message: "Inventory retrieved successfully",
      inventory
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve inventory",
      error: error.message
    });
  }
});

app.put("/inventory/:id", async (req, res) => {
  try {
    const { quantityAvailable } = req.body;

    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { quantityAvailable },
      {
        new: true,
        runValidators: true
      }
    ).populate("menuItem");

    if (!updatedInventory) {
      return res.status(404).json({
        message: "Inventory record not found"
      });
    }

    res.status(200).json({
      message: "Inventory updated successfully",
      inventory: updatedInventory
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update inventory",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});