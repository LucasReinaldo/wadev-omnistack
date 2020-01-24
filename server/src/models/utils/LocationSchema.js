const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    type: { //type = coluna
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: ['Number'],
        required: true,
    },
});

module.exports = LocationSchema;