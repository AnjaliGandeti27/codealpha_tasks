const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/Event");
const Registration = require("./models/Registration");

const app = express();
const PORT = 3000;

app.use(express.json());

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/eventregistration")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

// Home route
app.get("/", (req, res) => {
    res.send("Event Registration System Backend is running");
});

// Create an event
app.post("/events", async (req, res) => {
    try {
        const event = new Event(req.body);

        const savedEvent = await event.save();

        res.status(201).json({
            message: "Event created successfully",
            event: savedEvent
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create event",
            error: error.message
        });
    }
});

// Get all events
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find();

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
});

// Register a participant
app.post("/registrations", async (req, res) => {
    try {
        const { participantName, participantEmail, eventId } = req.body;

        // Check whether the event exists
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check for duplicate registration
        const existingRegistration = await Registration.findOne({
            participantEmail,
            eventId
        });

        if (existingRegistration) {
            return res.status(409).json({
                message: "Participant is already registered for this event"
            });
        }

        const registration = new Registration({
            participantName,
            participantEmail,
            eventId
        });

        const savedRegistration = await registration.save();

        res.status(201).json({
            message: "Registration successful",
            registration: savedRegistration
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid registration data",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// Get all registrations
app.get("/registrations", async (req, res) => {
    try {
        const registrations = await Registration.find();

        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch registrations",
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});