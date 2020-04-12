const Datastore = require('nedb');

var config = {
    pathCustomer: 'database/customer.db',
    pathWork: 'database/work.db',
    pathInvoice: 'database/invoice.db',
    pathBudget: 'database/budget.db'
}

var customer = new Datastore({ filename: config.pathCustomer, timestampData: true, autoload: true});
var work = new Datastore({ filename: config.pathWork, timestampData: true, autoload: true});
var invoice = new Datastore({ filename: config.pathInvoice, timestampData: true, autoload: true});
var budget = new Datastore({ filename: config.pathBudget, timestampData: true, autoload: true});

var connect = () => {
    if(customer && work && invoice && budget){
        return { customer, work, invoice, budget };
    }
}

module.exports = { connect };
