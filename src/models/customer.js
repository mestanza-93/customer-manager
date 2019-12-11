//const db = require('../../config/db');
const remote = require('electron').remote;
db = remote.getGlobal('database');
var customer = db.connect().customer;


// ID Autoincremental
customer.getCustomerAutoId = function (onFind) {
    customer.findOne({ _id: '__autoid__' }, function(err, doc){
        if (err){
            onFind && onFind(err)
        } else {
            customer.update({ _id: '__autoid__' }, { $set: { value: ++doc.value } }, {}, 
            function (err, count) {
                onFind && onFind(err, doc.value);
            });
        }
        return doc.value;
    });  
}

function getFormData(){
    var data = {};
    var id = customer.getCustomerAutoId();
    console.log(id);
    data['_id'] = id;
    document.querySelectorAll("input").forEach(ele => data[ele.name] = ele.value || "");
    console.log(data);
    return data;
}

function insertCustomer(){
    data = getFormData();
    customer.insert(data, function(err, insertedData){
        if(!err){
            console.log("Insert OK", insertedData.name);
        } else {
            console.log("ERROR: ", err);
        }
    });
}


