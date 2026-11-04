
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn("⚠️ [Crop Analyser] MONGO_URI not found in environment variables. Running in in-memory mode.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("✅ [Crop Analyser] MongoDB Atlas connected successfully!");
    } catch (error) {
        isConnected = false;
        console.warn("⚠️ [Crop Analyser] MongoDB connection failed (check Atlas IP Whitelist / Network):", error.message);
        console.warn("ℹ️  Backend will remain operational with fallback storage so frontend prototype functions without crash.");
    }
};

module.exports = connectDB;
