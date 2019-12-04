const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoIncrementModelID = require('./counter');

const customerSchema = new Schema({
    id: {type: Number, unique: true, min: 1},
    name: {type: String, required: true},
    surname: String,
    surname2: String,
    phone: Number,
    phone2: Number,
    address: String,
    town: String,
    work: String,
    installationDate: {type: Date, default: Date.now},
    modificationDate: {type: Date, default: Date.now},
    lastJobDate: {type: Date, default: Date.now},
    history: []
});

customerSchema.pre('save', function(next){
    if(!this.isNew){
        next();
        return;
    }
    autoIncrementModelID('customer', this, next);
});

module.exports = mongoose.model('customer', customerSchema);
