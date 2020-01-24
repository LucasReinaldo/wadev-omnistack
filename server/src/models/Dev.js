const mongoose = require('mongoose');
const LocationSchema = require('../models/utils/LocationSchema');

const DevSchema = new mongoose.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String], //Array de Strings
    location: { //recebe o ponto no mapa e o índice é uma esfera 2d.
        type: LocationSchema,
        indexes: '2dsphere'
    }
});

module.exports = mongoose.model('Dev', DevSchema);