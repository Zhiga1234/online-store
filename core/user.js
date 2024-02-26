const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    userId: String, 
    creationDate: Date,
    updateDate: Date,
    deletionDate: Date,
    adminStatus: Boolean,
    cart: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: { type: Number, default: 1 }
    }]
},{ collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = { User };
