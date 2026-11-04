
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const readingRoutes = require("./routes/readingRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/readings", readingRoutes);

// Health check API with detailed status
app.get("/api/health", (req, res) => {
    const dbState = mongoose.connection ? mongoose.connection.readyState : 0;
    const dbStatusMap = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };

    res.status(200).json({
        success: true,
        message: "Crop Analyser backend is running",
        timestamp: new Date().toISOString(),
        database: {
            status: dbStatusMap[dbState] || "unknown",
            isLive: dbState === 1
        },
        service: "Crop Analyser API v1.0",
        opticalSensorSpec: {
            redWavelengthNm: 660,
            nirWavelengthNm: 850,
            indexFormula: "(NIR - RED) / (NIR + RED)"
        }
    });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 [Crop Analyser] Server running on port ${PORT}`);
        console.log(`🌿 [Crop Analyser] Health endpoint: http://localhost:${PORT}/api/health`);
        console.log(`📊 [Crop Analyser] Readings endpoint: http://localhost:${PORT}/api/readings`);
    });
};

startServer();
