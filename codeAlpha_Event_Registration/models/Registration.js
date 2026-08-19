const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    participantName: {
        type: String,
        required: true,
        trim: true
    },

    participantEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },

    registrationDate: {
        type: Date,
        default: Date.now
    }
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;