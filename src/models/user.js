const fs = require('fs');
const jsonFile = require('../../config/user_data.json');
const fields = ['name', 'lastname', 'address', 'town', 'province', 'country', 'postalcode', 'dni', 'phone', 'email', 'iban'];
const app = require('electron').remote.app;
const path = require('path');


function getUserData() {

    for (var field of fields) {
        if (jsonFile[field] != '') {
            document.getElementById(field).value = jsonFile[field];
        }
    }
}

function updateUserData() {

    var data = {};

    for (var field of fields) {
        data[field] = document.getElementById(field).value;
    }

    fs.writeFile(path.join(app.getAppPath(), "config", "user_data.json"), JSON.stringify(data), function (err) {
        if (err) {
            throw err;
        } else {
            window.location.reload();
        }
    });
}


