const express = require("express");
const mongoose = require("mongoose");
const Url = require("./models/Url");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/urlshortener")
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.log("MongoDB connection error:", error));

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to URL Shortener Project");
});

// Create shortened URL
app.post("/shorten", async (req, res) => {
    try {
        const longUrl = req.body.longUrl;

        if (!longUrl) {
            return res.status(400).json({
                message: "longUrl is required"
            });
        }

        try {
            new URL(longUrl);
        } catch (error) {
            return res.status(400).json({
                message: "Please provide a valid URL"
            });
        }

        const newUrl = new Url({
            originalUrl: longUrl,
            shortCode: Math.random().toString(36).substring(2, 8)
        });

        // ...rest of your existing code

        // Save URL to MongoDB
        await newUrl.save();

        // Send shortened URL
        res.json({
            message: "URL shortened successfully",
            shortUrl: `http://localhost:3000/${newUrl.shortCode}`
        });

    } catch (error) {
        console.log("Error:", error);

        res.status(500).json({
            message: "Error saving URL"
        });
    }
});

// Redirect short URL to original URL
app.get("/:shortCode", async (req, res) => {
    try {
        const shortCode = req.params.shortCode;

        // Find the short code in MongoDB
        const url = await Url.findOne({
            shortCode: shortCode
        });

        // If short code doesn't exist
        if (!url) {
            return res.status(404).send("Short URL not found");
        }

        // Redirect to original URL
        res.redirect(url.originalUrl);

    } catch (error) {
        console.log("Redirect error:", error);

        res.status(500).send("Server error");
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});