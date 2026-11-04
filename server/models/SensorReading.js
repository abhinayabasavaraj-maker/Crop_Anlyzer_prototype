
const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema({
    plantId: {
        type: String,
        required: true,
        trim: true
    },
    experimentId: {
        type: String,
        required: true,
        trim: true
    },
    deviceId: {
        type: String,
        required: true,
        trim: true
    },
    // Calibrated normalized reflectance [0.0 - 1.0]
    redReflectance: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    nirReflectance: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    // NDVI-like index ranges from -1.0 to +1.0
    index: {
        type: Number,
        required: true,
        min: -1,
        max: 1
    },
    // Optional 16-bit raw ADS1115 ADC counts from BPW34 photodiode
    rawRedAdc: {
        type: Number,
        min: 0,
        max: 65535
    },
    rawNirAdc: {
        type: Number,
        min: 0,
        max: 65535
    },
    // Optional ESP32 device-computed values
    deviceCalculatedIndex: {
        type: Number,
        min: -1,
        max: 1
    },
    consistencyStatus: {
        type: String,
        enum: ["device_verified", "device_accepted", "server_computed", "discrepancy_flagged"],
        default: "device_verified"
    },
    // Derived scores [0 - 100]
    plantHealthScore: {
        type: Number,
        min: 0,
        max: 100
    },
    plantStressScore: {
        type: Number,
        min: 0,
        max: 100
    },
    source: {
        type: String,
        enum: ["simulated", "esp32"],
        default: "simulated"
    }
}, {
    timestamps: true
});

const SensorReading = mongoose.models.SensorReading || mongoose.model(
    "SensorReading",
    sensorReadingSchema
);

module.exports = SensorReading;
