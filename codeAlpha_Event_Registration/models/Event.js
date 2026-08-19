const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: Date,
        required: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    capacity: {
        type: Number,
        required: true,
        min: 1
    }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;