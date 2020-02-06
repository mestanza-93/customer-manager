const Datastore = require('nedb');
const path = require('path');
// require ('hazardous');

var config = {
    pathCustomer: path.join( process.cwd() , '..', 'database', 'customer.db'),
    pathWork: path.join( process.cwd(), '..', 'database', 'work.db')
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
