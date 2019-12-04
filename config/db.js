const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectId;

const configDB = {
    name: 'customermanager',
    url: 'mongodb://localhost',
    options: {useMongoClient: true, useNewUrlParser: true}
}

const state = {
    db : null
};

const connect = (cb) => {
    if(state.db)
        cb();
    else{
        mongoose.connect(configDB.url, configDB.options, (err, client) => {
            if(err)
                cb(err);
            else{
                state.db = client.db(configDB.name);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = {getDB, connect, getPrimaryKey};

