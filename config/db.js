const Datastore = require('nedb');
const path = require('path');

var config = {
    pathCustomer: path.join( __dirname, '..', 'database', 'customer.db'),
    pathWork: path.join( __dirname, '..', 'database', 'work.db')
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

// ID Autoincremental
customer.insert({ _id: '__autoid__', value: -1 });
work.insert({ _id: '__autoid__', value: -1 });

module.exports = { connect };
