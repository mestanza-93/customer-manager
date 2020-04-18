if (!remote) {
    const remote = require('electron').remote;
}
if (!db) {
    const db = remote.getGlobal('database');
}
const workDB = db.connect().work;


/**
 *  Get from new historic form.
 */
function getNewWorkData() {
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
 *  Get historic work of a customer by id
 */
function getCustomerWork(idCustomer, cb) {
    workDB.find({ id_customer: idCustomer }).sort({ timestamp: -1 }).exec(function (err, data) {
        if (err) {
            return cb(err);
        } else {
            return cb(data);
        }
    });
}

/**
 *  Get work data to edit from Form by id
 */
function getWorkToEdit(i) {
    var data = {};
    var today = new Date().toLocaleDateString("es");
    var timestamp = new Date().getTime();
    var textarea = document.querySelector('#textarea-work-edit-' + i).value;
    var datepicker = document.querySelector('#datepicker-work-edit-' + i).value;

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
 *  Get all Works 
 */
function getAllWorks(cb) {
    workDB.find({}, function (err, data) {
        if (err) {
            return cb(err);
        } else {
            var works = [];
            for (var element of data) { 
                works.push(element);
            }
            return cb(works);
        }
    });
}


/**
*   Create a new work with id customer in database calling
*   getFormData() to get info from the historic form.
*/
function insertWork(idCustomer) {
    var data = getNewWorkData();

    data['id_customer'] = idCustomer;
    if (data['work'] || data['date']) {
        workDB.insert(data, function (err, insertedData) {
            if (err) {
                toastr.error("No se ha creado el cliente correctamente.");
            } else {
                toastr.success("Trabajo creado con éxito.");
            }
        });
    } else {
        toastr.warning("Por favor introduzca datos esenciales.");
    }
}


/**
 * Edit work by id 
 */
function editWork(idWork, i) {
    var data = getWorkToEdit(i);

    if (data['work']) {
        workDB.update({ _id: idWork }, {
            $set: {
                work: data['work'], date: data['date'],
                timestamp: data['timestamp']
            }
        }, {}, function (err, num) {
            if (err) {
                toastr.error("No se ha podido editar historial");
            } else {
                toastr.success("Trabajo actualizado con éxito.");
            }
        });
    } else {
        toastr.warning("Introduzca algo en el historial.");
    }
}


/**
 *  Delete work by id work
 */
function deleteWork(idWork) {
    if (idWork) {
        workDB.remove({ _id: idWork }, function (err, num) {
            if (err) {
                toastr.error("No se ha podido eliminar el trabajo.");
            } else {
                toastr.success("Trabajo eliminado con éxito.");
            }
        });
    } else {
        toastr.error("No se ha podido eliminar el trabajo.");
    }
}


/**
 *  Delete all works of a Customer
 */
function deleteWorksCustomer(idCustomer, cb) {
    if (idCustomer) {
        workDB.remove({ id_customer: idCustomer }, { multi: true }, function (err, num) {
            if (err) {
                return cb(-1);
            } else if (num >= 1) {
                return cb('Remove');
            } else {
                cb('No remove');
            }
        });
    } else {
        return cb(-1);
    }
}

module.exports = { getCustomerWork, getAllWorks, insertWork, editWork, deleteWork, deleteWorksCustomer };