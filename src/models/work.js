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
    var textarea = document.querySelector('#textarea-work-new').value;
    var datepicker = document.querySelector('#datepicker-work-new').value;

    data['work'] = '';
    data['date'] = today;

    if (textarea) {
        data['work'] = textarea;
    }
    if (datepicker) {
        data['date'] = datepicker;
    }

    console.log(data);
    return data;
}


/**
*   Create a new work with id customer in database calling
*   getFormData() to get info from the historic form.
*/
function insertWork (id_customer) {
    var data = getNewWorkData();

    data['id_customer'] = id_customer;
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