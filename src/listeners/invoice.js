$(document).ready(function(){    
    
    var invoicejs = require('../models/invoice');
    var workjs = require('../models/work');

    var idCustomer = localStorage.getItem('id_customer');
    var idWork = localStorage.getItem('id_work');

    let jsonFile = require('../../config/user_data.json');
    document.getElementById("user-fullname").innerHTML = jsonFile['name'] + " " + jsonFile['lastname'];
    document.getElementById("user-address").innerHTML = jsonFile['address'];
    document.getElementById("user-town").innerHTML = jsonFile['town'] + ", " + jsonFile['country'];
    document.getElementById("user-postal-code").innerHTML = jsonFile['postalcode'] + " " + jsonFile['province'];
    document.getElementById("user-dni").innerHTML = "NIF: " + jsonFile['dni'];

    document.getElementById("footer-fullname").innerHTML = jsonFile['name'] + " " + jsonFile['lastname'];
    document.getElementById("footer-dni").innerHTML = "NIF: " + jsonFile['dni'];
    document.getElementById("footer-phone").innerHTML = "Teléfono: " + jsonFile['phone'];
    document.getElementById("footer-address").innerHTML = jsonFile['address'];
    document.getElementById("footer-town").innerHTML = jsonFile['town'];
    document.getElementById("footer-province").innerHTML = jsonFile['province'];
    document.getElementById("footer-email").innerHTML = "Correo elect: " + jsonFile['email'];

    getCustomer(idCustomer, function (customer) {
        var customerData = customer;


        document.getElementById("year").innerHTML = new Date().getFullYear();

        if (customerData['name'] && customerData['lastname']) {
           document.getElementById("customer-name").innerHTML = customerData['name'] + " " + customerData['lastname'];
        }

        if (customerData['address']) {
            document.getElementById("address").innerHTML = customerData['address'];
        }

        if (customerData['postalcode']) {
            document.getElementById("postal-code").innerHTML = customerData['postalcode'];
        }

        if (customerData['town']) {
            document.getElementById("town").innerHTML = customerData['town'];
        }

        if (customerData['dni']) {
            document.getElementById("dni").innerHTML = "NIF: " + customerData['dni'];
        }

    });

    workjs.getWork(idWork, function (work) {
        var workData = work;
        if (workData[0]['date']) {
            document.getElementById("today").innerHTML = workData[0]['date'];
        } else {
            document.getElementById("today").innerHTML = new Date().toLocaleDateString("es");
        }
        
    });



    invoicejs.getInvoice(idWork, function (invoice) {
        var invoiceData = invoice;

        var tableProducts = document.getElementById("products-body");
        var iva = 21;
        var baseSum = 0;
        var ivaSum = 0;
        var total = 0;

        for (var product of invoiceData) {

            var idInvoice = product['id_invoice'];
            document.getElementById("invoice-id").innerHTML = idInvoice;

            var row = document.createElement("tr");

            // Concept
            var conceptTD = document.createElement("td");
            conceptTD.classList.add("align-middle", "medium-text");
            conceptTD.innerHTML = product['concept'];

            row.appendChild(conceptTD);


            // Units
            var unitsTD = document.createElement("td");
            unitsTD.classList.add("text-center", "align-middle", "medium-text");
            unitsTD.innerHTML = product['units'];

            row.appendChild(unitsTD);


            // Base unit
            var baseTD = document.createElement("td");
            baseTD.classList.add("text-center", "align-middle", "medium-text");
            baseTD.innerHTML = parseFloat(product['base']).toFixed(2) + " €";

            row.appendChild(baseTD);


            // Base total
            var baseTotal = product['units'] * product['base'];
            baseSum += baseTotal;

            var baseTotalTD = document.createElement("td");
            baseTotalTD.classList.add("text-center", "align-middle", "medium-text");
            baseTotalTD.innerHTML = parseFloat(baseTotal).toFixed(2) + " €";

            row.appendChild(baseTotalTD);


            // IVA %
            var ivaTD = document.createElement("td");
            ivaTD.classList.add("text-center", "align-middle", "medium-text");
            var iva = product['iva'];
            ivaTD.innerHTML = parseFloat(iva).toFixed(2) + " %";

            row.appendChild(ivaTD);


            // IVA price
            var ivaTotal = product['iva'] * baseTotal / 100;
            ivaSum += ivaTotal;

            var ivaTotalTD = document.createElement("td");
            ivaTotalTD.classList.add("text-center", "align-middle", "medium-text");
            ivaTotalTD.innerHTML = parseFloat(ivaTotal).toFixed(2) + " €";

            row.appendChild(ivaTotalTD);

            // Add row to table
            tableProducts.appendChild(row);
        }

        total = baseSum + ivaSum;
        document.getElementById("tax-iva").innerHTML = parseFloat(iva).toFixed(2) + " %";
        document.getElementById("total-base-sum").innerHTML = parseFloat(baseSum).toFixed(2) + " €";
        document.getElementById("total-iva-sum").innerHTML = parseFloat(ivaSum).toFixed(2) + " €";
        document.getElementById("total").innerHTML = parseFloat(total).toFixed(2) + " €";


        $('.btn-pdf').on('click', function () {
            const jspdf = require('jspdf');
            const domtoimage = require('dom-to-image');
    
            $('#page').css('margin-left', '0');
            var year = new Date().getFullYear();
    
            domtoimage.toPng(document.getElementById('page')).then(function (blob) {
                var pdf = new jspdf('p', 'mm', "a4");
                var width = pdf.internal.pageSize.getWidth();
                var height = pdf.internal.pageSize.getHeight();
    
                pdf.addImage(blob, 'PNG', 0, 0, width, height, 'test', 'MEDIUM', 0);
                pdf.save("Factura " + year + "-" + idInvoice + ".pdf", { returnPromise: true }).then(window.location.href = "customer.html");
    
            });
        });
    });
});