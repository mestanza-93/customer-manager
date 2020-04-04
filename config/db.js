const Datastore = require('nedb');
const path = require('path');

var config = {
    pathCustomer: 'database/customer.db',
    pathWork: 'database/work.db',
    pathInvoice: 'database/invoice.db'
}

var customer = new Datastore({ filename: config.pathCustomer, timestampData: true, autoload: true});
var work = new Datastore({ filename: config.pathWork, timestampData: true, autoload: true});
var invoice = new Datastore({ filename: config.pathInvoice, timestampData: true, autoload: true});

var connect = () => {
    if(customer && work && invoice){
        return { customer, work, invoice };
    }
}

module.exports = { connect };
