const express = require("express");
const router = express.Router();
const Dealership = require("../models/Dealership");
router.get("/", async (req, res) => {
    try {
        const data = await Dealership.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newDealer = new Dealership(req.body);
        const saved = await newDealer.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: "Invalid data" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Dealership.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

module.exports = router;
