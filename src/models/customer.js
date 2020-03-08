const remote = require('electron').remote;
const db = remote.getGlobal('database');
const customerDB = db.connect().customer;

const toastr = require('toastr');
toastr.options = {
  "progressBar": true,
  "positionClass": "toast-top-center",
  "timeOut": 750,
  "fadeOut": 750,
  "onHidden": function () { window.location.reload(); }
}

const columnsDatatable = [ 'name', 'lastname', 'phone', 'address', '_id', 'dni', 'postalcode', 'phone2', 'town' ];


/**
*   Get data from the form and format it to insert.
*/
function getFormData () {
    var data = {};
    document.querySelectorAll("input").forEach(ele => data[ele.name] = ele.value || "");
    
    return data;
}


/**
*   Create a new Customer in database calling
*   getFormData() to get info from the form.
*/
function insertCustomer () {
    var data = getFormData();
    
    if (data['name'] || data['phone'] || data['address']) {
        customerDB.insert(data, function(err, insertedData) {
            if(err){
                toastr.error("No se ha creado el cliente correctamente.");
            } else {
                localStorage.setItem('id_customer', insertedData['_id']);
                toastr.options.onHidden = function () { window.location.assign("customer.html"); }
                toastr.success('Cliente creado con éxito.');
            }
        });
    } else {
        toastr.warning("Por favor introduzca un nombre");
    }  
}


/**
 *  Get all customers data then call processCustomersData()
 *  to format the data for Datatables
 */
function getAllCustomers (cb) {
    customerDB.find({}, function(err, data) {
        if (err) {
            return cb(err);        
        } else {
            /*
            Get columns to show in Datatables and format this data to 
            show correctly in Datatables.
            */
            var customers = [];
            for (var element of data) {
                var ele = {};
                for (var column of columnsDatatable) {
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
function getCustomer (idCustomer, cb) {
    customerDB.find({_id: idCustomer}, function(err, data) {
        if (err) {
            return cb(err);
        } else {
            var ele = {};
            for (var column of columnsDatatable) {
                ele[column] = data[0][column];
            }
            return cb(ele);
        }
    });
}


/**
 *  Edit a customer by id
 */
function editCustomer (idCustomer) {
    var data = getFormData();

    if (data['name']) {
        customerDB.update({_id: idCustomer}, { $set: {name: data['name'], lastname: data['lastname'], 
            dni: data['dni'], postalcode: data['postalcode'], phone: data['phone'], phone2: data['phone2'], address: data['address'],
            town: data['town']}}, {}, function (err, num){
                if (err) {
                    toastr.error("No se ha podido editar el cliente");
                } else {
                    toastr.success("Cliente actualizado con éxito.");
                }
        });
    } else {
        toastr.warning("No se ha podido editar el cliente.");
    }   
}


/**
 *  Delete work by id
 */
function deleteCustomer(idCustomer) {
    if (idCustomer) {
        customerDB.remove({_id: idCustomer}, function(err, num) {
            if (err) {
                toastr.error("No se ha podido eliminar el cliente.");
            } else {
                var res;
                workjs.deleteWorksCustomer(idCustomer, function(result){
                    res = result;
                    if (res == 'No remove') {
                        toastr.options.onHidden = function () { window.location.assign("index.html"); }
                        toastr.success("Cliente eliminado con éxito.");
                        
                    } else if (res == 'Remove') {
                        toastr.options.onHidden = function () { window.location.assign("index.html"); }
                        toastr.success("Cliente y su historial eliminado con éxito.");
                    } else {
                        toastr.error("No se ha podido eliminar el historial del cliente.");
                    }
                });
            }
        });
    } else {
        toastr.error("No se ha podido eliminar el cliente.");
    }
}


function getAllCustomersWork(cb){
    var customersData = {};
    getAllCustomers(function (customers) {
        customersData = customers;
        console.log(customers);
    });
    var customersWork = {};
    var cont = 0;
    console.log(customersData);
    for (customer in customersData) {
        console.log("customer");
        if (customer['name'] && customer['name'] != '') {
            var workData = {};
            workjs.getCustomerWork(customer['_id'], function (work) {
                workData = work;
            });

            for (var work in workData) {
                if (work['date'] && work['date'] != '') {
                    customersWork[cont]['title'] = customer['name'];
                    customersWork[cont]['startDate'] = work['date'];
                }
                cont++;
            }     
        }
        cont++;
    }
    console.log(cont);
    
    console.log(customersWork);
    return cb(customersWork);
}