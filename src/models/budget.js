if (!remote) {
    const remote = require('electron').remote;
}
if (!db) {
    const db = remote.getGlobal('database');
}
const budgetDB = db.connect().budget;


/**
 *  Get the budget of the work
 */
function getBudget(idWork, cb) {
    budgetDB.find({ id_work: idWork }).sort({ timestamp: 1 }).exec(function (err, data) {
        if (err) {
            return cb(err);
        } else {
            return cb(data);
        }
    });
}


/**
 *  Get the budget of the work
 */
function getLastIdBudget(cb) {
    budgetDB.find({}).sort({ id_budget: -1 }).limit(1).exec(function (err, data) {
        if (err) {
            return cb(err);
        } else {
            if (data[0]) {
                return cb(data[0]['id_budget']);
            } else {
                return "0000";
            }
        }
    });
}


/**
 *  Get from budget modal
 */
function getBudgetData() {
    var data = [];
    var cont = 0;
    var forms = document.querySelectorAll('#budget-form');
    var idBudget = document.querySelector('#budget-id');
    var iva = document.querySelector('#budget-iva');

    for (var form of forms) {
        data[cont] = form.elements;
        data[cont]['id_budget'] = idBudget;
        data[cont]['iva'] = iva;
        cont++;
    }

    return data;
}


/**
*   Create a new budget with id work in database calling
*/
function insertBudget(idWork) {
    var data = [];
    var insertData = {};
    var today = new Date().toLocaleDateString("es");

    data = getBudgetData();

    for (var product of data) {
        if (product['concept'].value && product['units'].value && product['base'].value && product['iva'].value && product['id_budget'].value && idWork) {

            var timestamp = new Date().getTime();
            insertData['concept'] = product['concept'].value;
            insertData['units'] = product['units'].value;
            insertData['base'] = product['base'].value;
            insertData['iva'] = product['iva'].value;
            insertData['id_budget'] = product['id_budget'].value;
            insertData['id_work'] = idWork;
            insertData['date'] = today;
            insertData['timestamp'] = timestamp;

            budgetDB.update({ id_budget: insertData['id_budget'], id_work: insertData['id_work'], concept: insertData['concept'], base: insertData['base'] }, { $set: { concept: insertData['concept'], units: insertData['units'], base: insertData['base'], iva: insertData['iva'], id_budget: insertData['id_budget'], id_work: insertData['id_work'], date: insertData['date'], timestamp: insertData['timestamp'] } }, { upsert: true }, function (err, num) {
                if (err) {
                    toastr.error("No se ha creado el presupuesto correctamente.");
                }
            });
        }
    }

    toastr.options.onHidden = function () { window.location.assign("budget.html"); }
    toastr.success("Presupuesto creado con éxito.");
}


/**
 *  Delete work by id
 */
function deleteProduct(idBudget) {
    if (idBudget) {
        budgetDB.remove({ _id: idBudget }, function (err, num) {
            if (err) {
                toastr.error("No se ha podido eliminar el producto.");
            }
        });
    } else {
        toastr.error("No se ha podido eliminar el producto.");
    }
}


/**
 *  Refresh listener when the form hides.
 */
function refreshListenerBudget() {
    $('.btn-delete-product-budget').off();

    $('.btn-delete-product-budget').on('click', function () {
        var idProduct = this.id;
        var row = this.name;

        if (row == '') {
            $('#budget-form').hide();
        }

        $('form[name="budget-form' + row + '"]').hide();           

        if (idProduct && idProduct != '') {
            budgetjs.deleteProduct(idProduct);
        }

    });
}

module.exports = { getBudget, getLastIdBudget, insertBudget, deleteProduct, refreshListenerBudget };