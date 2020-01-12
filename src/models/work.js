if (!remote){
    const remote = require('electron').remote;
}
if (!db){
    const db = remote.getGlobal('database');
}
const workDB = db.connect().work;



/**
 *  Get from new historic form.
 */
function getNewWorkData () {
    var data = {};
    var today = new Date().toLocaleDateString("es");
    var timestamp = new Date().getTime();
    var textarea = document.querySelector('#textarea-work-new').value;
    var datepicker = document.querySelector('#datepicker-work-new').value;

    data['work'] = '';
    data['date'] = today;
    data['timestamp'] = timestamp;

    if (textarea) {
        data['work'] = textarea;
    }
    if (datepicker) {
        data['date'] = datepicker;
        data['timestamp'] = new Date(datepicker.split('/').reverse().join('/')).getTime();
    }

    return data;
}


/**
*   Create a new work with id customer in database calling
*   getFormData() to get info from the historic form.
*/
function insertWork (idCustomer) {
    var data = getNewWorkData();

    data['id_customer'] = idCustomer;
    if (data['work'] || data['date']) {
        workDB.insert(data, function(err, insertedData) {
            if(err){
                alert("No se ha creado el cliente correctamente.");
            }
        });
    } else {
        alert("Por favor introduzca datos esenciales.");
    }  
}


/**
 *  Get historic work of a customer by id
 */
function getCustomerWork (idCustomer, cb) {
    workDB.find({id_customer: idCustomer}).sort({timestamp: -1}).exec(function(err, data) {
        if (err) {
            console.err("ERROR: ", err);
            return cb(err);
        } else {
            // var ele = {};
            // for (column of columnsDatatable) {
            //     ele[column] = data[0][column];
            // }
            // return cb(ele);
            return cb(data);
        }
    });
}

function editWork (work) {
    console.log(work);
}