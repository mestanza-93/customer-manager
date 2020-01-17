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
            } else {
                toastr.success("Trabajo creado con éxito.");
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
            return cb(data);
        }
    });
}

/**
 *  Get work data to edit from Form by id
 */
function getWorkToEdit(i){
    var data = {};
    var today = new Date().toLocaleDateString("es");
    var timestamp = new Date().getTime();
    var textarea = document.querySelector('#textarea-work-edit-'+i).value;
    var datepicker = document.querySelector('#datepicker-work-edit-'+i).value;

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
 * Edit work by id 
 */
function editWork (idWork, i) {
    var data = getWorkToEdit(i);
    
    if (data['work']) {
        workDB.update({_id: idWork}, { $set: {work: data['work'], date: data['date'], 
            timestamp: data['timestamp']}}, {}, function (err, num){
                if (err) {
                    alert("No se ha podido editar historial");
                } else {
                    toastr.success("Trabajo actualizado con éxito.");
                }
        });
    } else {
        alert("Introduzca algo en el historial.");
    } 
}


/**
 *  Delete work by id
 */
function deleteWork(idWork) {
    if (idWork) {
        workDB.remove({_id: idWork}, function(err, num) {
            if (err) {
                alert("No se ha podido eliminar el trabajo.");
                console.error(err);
            } else {
                //window.location.reload();
                toastr.success("Trabajo eliminado con éxito.");
            }        
        });
    } else {
        alert("No se ha podido eliminar el trabajo.");
    }  
}