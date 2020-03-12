const Datastore = require('nedb');
const path = require('path');

var config = {
    pathCustomer: '../database/customer.db',
    pathWork: '../database/work.db'
}

var customer = new Datastore({ filename: config.pathCustomer, timestampData: true, autoload: true});
var work = new Datastore({ filename: config.pathWork, timestampData: true, autoload: true});

var connect = () => {
    if(customer && work){
        //console.log('Conectado a la Base de Datos correctamente.');
        return { customer, work };
    }
    else{
        //console.log('No es posible conectar a la Base de Datos.');
    }
}

module.exports = { connect };
