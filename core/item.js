const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        en: {
            type: String,
            required: true
        },
        ru: {
            type: String,
            required: true
        }
    },
    description: {
        en: {
            type: String,
            required: true
        },
        ru: {
            type: String,
            required: true
        }
    },
    pictureUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
});


const Item = mongoose.model('Item', itemSchema);

module.exports = {Item};