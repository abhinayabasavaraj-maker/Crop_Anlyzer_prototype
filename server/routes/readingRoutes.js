
const express = require("express");
const router = express.Router();

const {
    createReading,
    getReadings,
    getLatestReading
} = require("../controllers/readingController");

// Primary endpoint required by specification
router.post("/", createReading);

// Additional complementary endpoints for frontend queries
router.get("/", getReadings);
router.get("/latest", getLatestReading);

module.exports = router;
