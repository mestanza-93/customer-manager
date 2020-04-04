if (!remote) {
    const remote = require('electron').remote;
}
if (!db) {
    const db = remote.getGlobal('database');
}
const invoiceDB = db.connect().invoice;


/**
 *  Get the invoice of the work
 */
function getInvoice(idWork, cb) {
    invoiceDB.find({ id_work: idWork }).sort({ timestamp: 1 }).exec(function (err, data) {
        if (err) {
            return cb(err);
        } else {
            return cb(data);
        }
    });
}


/**
 *  Get from invoice modal
 */
function getInvoiceData() {
    var data = [];
    var cont = 0;
    var forms = document.querySelectorAll('#invoice-form');
    var idInvoice = document.querySelector('#invoice-id');
    var iva = document.querySelector('#iva');

    for (var form of forms) {
        data[cont] = form.elements;
        data[cont]['id_invoice'] = idInvoice;
        data[cont]['iva'] = iva;
        cont++;
    }

    return data;
}


/**
*   Create a new invoice with id work in database calling
*/
function insertInvoice(idWork) {
    var data = [];
    var insertData = {};
    var today = new Date().toLocaleDateString("es");

    data = getInvoiceData();

    for (var product of data) {
        if (product['concept'].value && product['units'].value && product['base'].value && product['iva'].value && product['id_invoice'].value && idWork) {

            var timestamp = new Date().getTime();
            insertData['concept'] = product['concept'].value;
            insertData['units'] = product['units'].value;
            insertData['base'] = product['base'].value;
            insertData['iva'] = product['iva'].value;
            insertData['id_invoice'] = product['id_invoice'].value;
            insertData['id_work'] = idWork;
            insertData['date'] = today;
            insertData['timestamp'] = timestamp;

            invoiceDB.update({ id_invoice: insertData['id_invoice'], id_work: insertData['id_work'], concept: insertData['concept'], base: insertData['base'] }, { $set: { concept: insertData['concept'], units: insertData['units'], base: insertData['base'], iva: insertData['iva'], id_invoice: insertData['id_invoice'], id_work: insertData['id_work'], date: insertData['date'], timestamp: insertData['timestamp'] } }, { upsert: true }, function (err, num) {
                if (err) {
                    toastr.error("No se ha creado la factura correctamente.");
                }
            });
        }
    }

    toastr.options.onHidden = function () { window.location.assign("invoice.html"); }
    toastr.success("Factura creada con éxito.");
}

/**
 *  Delete work by id
 */
function deleteProduct(idInvoice) {
    if (idInvoice) {
        invoiceDB.remove({ _id: idInvoice }, function (err, num) {
            if (err) {
                toastr.error("No se ha podido eliminar el producto.");
            }
        });
    } else {
        toastr.error("No se ha podido eliminar el producto.");
    }
}

module.exports = { getInvoice, insertInvoice, deleteProduct };