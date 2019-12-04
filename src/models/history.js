const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    id: {type: Number, unique: true, min: 1},
    date: {type: Date, required: true},
    info: String
});

module.exports = mongoose.model('history', historySchema);