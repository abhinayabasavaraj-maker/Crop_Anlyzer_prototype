
const mongoose = require("mongoose");
const SensorReading = require("../models/SensorReading");

// In-memory fallback store if MongoDB Atlas is disconnected or not reachable
const inMemoryReadings = [];

/**
 * Derives illustrative Plant Health Score (0-100) from NDVI-like index (-1 to +1)
 * Note: Index is NOT simply multiplied by 100.
 * Negative indices (-1 to 0) represent non-vegetative surfaces, necrotic/dry leaf tissue, or extreme stress (0-15 health).
 * Indices 0.0 to 0.20 represent severe chlorosis or stress (15-35 health).
 * Indices 0.20 to 0.45 represent moderate stress (35-70 health).
 * Indices > 0.45 represent healthy vegetative mesophyll (70-100 health).
 */
const deriveHealthScore = (index) => {
    if (typeof index !== "number" || isNaN(index)) return 50;
    if (index < 0) {
        return Math.max(0, Math.round((index + 1) * 15)); // -1 -> 0, 0 -> 15
    }
    if (index < 0.20) {
        return Math.round(15 + (index / 0.20) * 20); // 0 -> 15, 0.20 -> 35
    }
    if (index < 0.45) {
        return Math.round(35 + ((index - 0.20) / 0.25) * 35); // 0.20 -> 35, 0.45 -> 70
    }
    return Math.min(100, Math.round(70 + ((index - 0.45) / 0.55) * 30)); // 0.45 -> 70, 1.0 -> 100
};

const createReading = async (req, res) => {
    try {
        const {
            plantId,
            experimentId,
            deviceId,
            redReflectance,
            nirReflectance,
            index: deviceIndex, // Optional index sent directly from ESP32
            rawRedAdc,
            rawNirAdc,
            source
        } = req.body;

        if (
            typeof redReflectance !== "number" ||
            typeof nirReflectance !== "number" ||
            !Number.isFinite(redReflectance) ||
            !Number.isFinite(nirReflectance) ||
            redReflectance < 0 ||
            redReflectance > 1 ||
            nirReflectance < 0 ||
            nirReflectance > 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid reflectance values. Calibrated values must be between 0.00 and 1.00."
            });
        }

        if (
            ![plantId, experimentId, deviceId].every(
                value => typeof value === "string" && value.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Plant ID, Experiment ID and Device ID are required."
            });
        }

        const denominator = nirReflectance + redReflectance;

        if (denominator === 0) {
            return res.status(400).json({
                success: false,
                message: "Both reflectance values cannot be zero (denominator is zero)."
            });
        }

        // Server calculated reference index: (NIR - RED) / (NIR + RED)
        const serverComputedIndex = parseFloat(((nirReflectance - redReflectance) / denominator).toFixed(4));

        // As per hardware architecture: The ESP32 is the primary calculator.
        // If device provided an index, validate consistency without silently replacing it.
        let finalIndex = serverComputedIndex;
        let consistencyStatus = "server_computed";

        if (typeof deviceIndex === "number" && Number.isFinite(deviceIndex)) {
            const indexDiff = Math.abs(deviceIndex - serverComputedIndex);
            if (indexDiff <= 0.02) {
                finalIndex = parseFloat(deviceIndex.toFixed(4));
                consistencyStatus = "device_verified";
            } else {
                // Keep device index as authoritative primary, but flag consistency note
                finalIndex = parseFloat(deviceIndex.toFixed(4));
                consistencyStatus = "discrepancy_flagged";
            }
        }

        // Bounds validation on index [-1.0 to +1.0]
        finalIndex = Math.max(-1, Math.min(1, finalIndex));

        const healthScore = deriveHealthScore(finalIndex);
        const stressScore = 100 - healthScore;

        const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

        let reading;

        const readingData = {
            plantId,
            experimentId,
            deviceId,
            redReflectance,
            nirReflectance,
            index: finalIndex,
            deviceCalculatedIndex: typeof deviceIndex === "number" ? deviceIndex : undefined,
            consistencyStatus,
            rawRedAdc: typeof rawRedAdc === "number" ? rawRedAdc : undefined,
            rawNirAdc: typeof rawNirAdc === "number" ? rawNirAdc : undefined,
            plantHealthScore: healthScore,
            plantStressScore: stressScore,
            source: source || "simulated"
        };

        if (isDbConnected) {
            reading = await SensorReading.create(readingData);
        } else {
            // In-memory fallback
            reading = {
                _id: "mem_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
                ...readingData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            inMemoryReadings.unshift(reading);
            if (inMemoryReadings.length > 250) inMemoryReadings.pop();
        }

        return res.status(201).json({
            success: true,
            message: "Sensor reading processed and recorded successfully",
            data: reading,
            storage: isDbConnected ? "mongodb" : "memory_fallback"
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error("Error saving reading:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getReadings = async (req, res) => {
    try {
        const { plantId, experimentId, limit = 50 } = req.query;
        const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

        if (isDbConnected) {
            const filter = {};
            if (plantId) filter.plantId = plantId;
            if (experimentId) filter.experimentId = experimentId;

            const readings = await SensorReading.find(filter)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit));

            return res.status(200).json({
                success: true,
                count: readings.length,
                storage: "mongodb",
                data: readings
            });
        } else {
            let filtered = inMemoryReadings;
            if (plantId) filtered = filtered.filter(r => r.plantId === plantId);
            if (experimentId) filtered = filtered.filter(r => r.experimentId === experimentId);

            return res.status(200).json({
                success: true,
                count: filtered.slice(0, parseInt(limit)).length,
                storage: "memory_fallback",
                data: filtered.slice(0, parseInt(limit))
            });
        }
    } catch (error) {
        console.error("Error fetching readings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve readings"
        });
    }
};

const getLatestReading = async (req, res) => {
    try {
        const { plantId } = req.query;
        const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

        if (isDbConnected) {
            const filter = plantId ? { plantId } : {};
            const reading = await SensorReading.findOne(filter).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: reading
            });
        } else {
            const reading = plantId
                ? inMemoryReadings.find(r => r.plantId === plantId)
                : inMemoryReadings[0];

            return res.status(200).json({
                success: true,
                data: reading || null
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get latest reading"
        });
    }
};

module.exports = { createReading, getReadings, getLatestReading };
