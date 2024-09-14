const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AssetSchema = new Schema({
    user_id: {
        type: Number,
        required: [true, "Please provide a balance"],
        unique: [true, "User_ID must be unique"]
    },
    symbol: {
        type: String,
        required: [true, "Please provide a symbol"],
        unique: false,
    },
    address: {
        type: String,
        required: [true, "Please provide a symbol"],
        unique: true,
    }
});

const Asset = mongoose.models.Asset || mongoose.model('Asset', AssetSchema);

module.exports = Asset;
