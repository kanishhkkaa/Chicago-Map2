const mongoose = require("mongoose");

const dealershipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: String,
    rating: Number,
    review: String
});

module.exports = mongoose.model("Dealership", dealershipSchema);
