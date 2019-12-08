var Datastore = require('nedb');

var config = {
    pathCustomer: '../database/customer.db',
    pathHistory: '../database/history.db'
}

var customer = new Datastore({ filename: config.pathCustomer, timestampData: true, autoload: true});
var history = new Datastore({ filename: config.pathHistory, timestampData: true, autoload: true});

var connect = () => {
    if(customer && history){
        //console.log('Conectado a la Base de Datos correctamente.');
        return {customer, history};
    }
    else{
        //console.log('No es posible conectar a la Base de Datos.');
    }
}

//console.log(connect());

module.exports = {connect};
