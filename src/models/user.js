let fs = require('fs');
let jsonFile = require('../../config/user_data.json');
let fields = ['name', 'lastname', 'address', 'town', 'province', 'country', 'postalcode', 'dni', 'phone', 'email'];


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

    fs.writeFile('./config/user_data.json', JSON.stringify(data), function (err) {
        if (err) {
            throw err;
        }
    });
}


