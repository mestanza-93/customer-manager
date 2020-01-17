const remote = require('electron').remote;
const db = remote.getGlobal('database');
const customerDB = db.connect().customer;

const toastr = require('toastr');
toastr.options = {
  "progressBar": true,
  "positionClass": "toast-top-center",
  "timeOut": 600,
  "fadeOut": 600,
  "onHidden": function() {
      window.location.reload();
  }
}

const columnsDatatable = [ 'name', 'lastname', 'phone', 'address', '_id', 'email', 'phone2', 'town' ];


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
            console.log(insertedData);
            if(err){
                alert("No se ha creado el cliente correctamente.");
            } else {
                localStorage.setItem('id_customer', insertedData['_id']);
                toastr.success('Cliente creado con éxito.');
                toastr.options.onHidden = window.location.assign("customer.html");
            }
        });
    } else {
        alert("Por favor introduzca un nombre");
    }  
}


/**
 *  Get all customers data then call processCustomersData()
 *  to format the data for Datatables
 */
function getAllCustomers (cb) {
    customerDB.find({}, function(err, data) {
        if (err) {
            console.err("ERROR: ", err);
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
function getCustomer (idCustomer, cb) {
    customerDB.find({_id: idCustomer}, function(err, data) {
        if (err) {
            console.err("ERROR: ", err);
            return cb(err);
        } else {
            var ele = {};
            for (column of columnsDatatable) {
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
            email: data['email'], phone: data['phone'], phone2: data['phone2'], address: data['address'],
            town: data['town']}}, {}, function (err, num){
                if (err) {
                    alert("No se ha podido editar el cliente");
                } else {
                    toastr.success("Cliente actualizado con éxito.");
                }
        });
    } else {
        alert("No se ha podido editar el cliente.");
    }   
}


/**
 *  Delete work by id
 */
function deleteCustomer(idCustomer) {
    if (idCustomer) {
        customerDB.remove({_id: idCustomer}, function(err, num) {
            if (err) {
                alert("No se ha podido eliminar el cliente.");
                console.error(err);
            } else {
                window.location.href = '../views/index.html';
                toastr.success("Cliente eliminado con éxito.");
            }
        });
    } else {
        alert("No se ha podido eliminar el cliente.");
    }  
}