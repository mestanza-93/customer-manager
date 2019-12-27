const remote = require('electron').remote;
const db = remote.getGlobal('database');
const customerDB = db.connect().customer;

const columnsDatatable = [ 'name', 'lastname', 'phone', 'address', '_id', 'email', 'phone2', 'town', 'postal_code' ];

/**
*   Get data from the form and format it to insert.
*/
function getFormData () {
    var data = {};
    document.querySelectorAll("input").forEach(ele => data[ele.name] = ele.value || "");
    console.log(data);
    return data;
}


/**
*   Create a new Customer in database calling
*   getFormData() to get info from the form.
*/
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


/**
 *  Get all customers data then call processCustomersData()
 *  to format the data for Datatables
 */
function getAllCustomers (cb) {
    customerDB.find({}, function(err, data) {
        if (err) {
            console.log("ERROR: ", err);
            return cb(err);        
        } else {
            /*
            Get columns to show in Datatables and format this data to 
            show correctly in Datatables.
            */
            var customers = [];
            for (element of data) {
                var ele = {};
                for (column of columnsDatatable) {
                    ele[column] = element[column];
                }
                customers.push(ele);
            }
            return cb(customers);
        }
    });  
}

/**
 *  Get a customer by id from Datatable row
 */
function getCustomer (id, cb) {
    customerDB.find({_id: id}, function(err, data) {
        if (err) {
            console.log("ERROR: ", err);
            return cb(err);
        } else {
            var ele = {};
            for (column of columnsDatatable) {
                ele[column] = data[0][column];
            }
            console.log(id, ele);
            return cb(data);
        }
    });
}