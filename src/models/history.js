const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoIncrementModelID = require('./counter');

const historySchema = new Schema({
    id: {type: Number, unique: true, min: 1},
    date: {type: Date, required: true},
    info: String
});

historySchema.pre('save', function(next){
    if(!this.isNew){
        next();
        return;
    }
    autoIncrementModelID('history', this, next);
});

module.exports = mongoose.model('history', historySchema);