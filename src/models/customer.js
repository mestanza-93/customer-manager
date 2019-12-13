const remote = require('electron').remote;
const db = remote.getGlobal('database');
const customerDB = db.connect().customer;


function getFormData () {
    var data = {};
    document.querySelectorAll("input").forEach(ele => data[ele.name] = ele.value || "");
    console.log(data);
    return data;
}


function insertCustomer () {
    var data = getFormData();
    if (data) {
        customerDB.insert(data, function(err, insertedData) {
            if(!err){
                console.log("Insert OK", insertedData.name);
            } else {
                console.log("ERROR: ", err);
            }
        });
    } else {
        console.log("No se ha generado ID.");
    }  
}


function getAllCustomers () {
    customerDB.find({}, function(err, data) {
        if (err) {
            console.log("ERROR: ", err);
            return {};
        } else {
            var customers = processCustomersData(data);
            console.log("Customers: ", data);
            return customers;
        }
    });
}

function processCustomersData (customers) {
    data = [];
    customers.forEach(ele => data[ele.name] = ele.value || "");
    console.log(data);
}


/*
function getCustomerAutoId () {
    customer.findOne({ _id: '__autoid__' }, function (err, doc){
        if (err){
            console.log("ERROR: ", err);
        } else {
            console.log("Last ID: ", doc.value);
            id = doc.value;
            customer.update({ _id: '__autoid__' }, { $set: { value: ++doc.value } }, {}, 
            function (err, count) {
                if (err) {
                    console.log("ERROR updating autoid.");
                } else {
                    console.log("Autoid updated: ", doc.value);
                    return doc.value;
                }
            });
        }
    });
}
*/