$(document).ready(function(){
        
    var customerData = {};
    getCustomer(idCustomer, function (customer) {
        customerData = customer;
        
        document.getElementById('name-edit').value = customerData['name'];
        document.getElementById('lastname-edit').value = customerData['lastname'];
        document.getElementById('dni-edit').value = customerData['dni'];
        document.getElementById('postalcode-edit').value = customerData['postalcode'];
        document.getElementById('phone-edit').value = customerData['phone'];
        document.getElementById('phone2-edit').value = customerData['phone2'];
        document.getElementById('address-edit').value = customerData['address'];
        document.getElementById('town-edit').value = customerData['town'];
    });

    var workData = {};
    workjs.getCustomerWork(idCustomer, function (work) {
        workData = work;
            
        for (var i=0; i<workData.length; i++) {                  
            var html = '<form action="#" class="form" id="historic-edit-' + i + '" name="historic-edit" onSubmit="workjs.editWork(\'' + workData[i]['_id'] + '\', \'' + i + '\'); return false;"><div class="form-group p-1"><div class="row"><div class="col-8"><textarea class="form-control" rows="6" id="textarea-work-edit-' + i + '">' + workData[i]['work'] + '</textarea></div><div class="col-3"><div class="row"><div class="col-md-12 input-group date p-1"><input type="text" value="' + workData[i]['date'] + '" class="form-control" id="datepicker-work-edit-' + i + '" placeholder="DD/MM/YYYY"><div class="input-group-addon"><span id="span-cal" post-id="' + i + '" class="fa fa-calendar bigicon"></span></div></input></div></div><div class="row"><div class="col-md-6 p-1"><button class="btn btn-warning btn-md" type="submit" style="width:100%;">Editar</button></div><div class="col-md-6 p-1"><button type="button" class="btn btn-danger btn-md" style="width:100%;" onclick="var result = confirm(\'¿Está seguro que quiere borrar el trabajo?\'); if (result) {workjs.deleteWork(\'' + workData[i]['_id'] + '\');}">Borrar</button></div></div><div class="row"><div class="col-md-6 p-1"><button type="button" style="width:100%;" id="btn-open-invoice-' + i + '" class="btn btn-primary btn-md btn-open-invoice" data-toggle="modal" data-target="#invoiceModal">Factura</button></div><div class="col-md-6 p-1"><button type="button" style="width:100%;" id="btn-open-budget-' + i + '" class="btn btn-secondary btn-md btn-open-budget" data-toggle="modal" data-target="#budgetModal">Presup.</button></div></div></div></div></div></form>';
            $('.historic-edit').append(html);
            $('#datepicker-work-edit-' + i).datepicker({
                language: 'es'                   
            });
        }

        /**
         *  Invoice functionality
         */

        var numInvoiceProducts = 0;

        $('.btn-open-invoice').on('click', function() {
            var id = this.id;
            id = id.replace('btn-open-invoice-', '');
            var idWork = workData[id]['_id']
            $('#id-work-invoice').val(idWork);
            localStorage.setItem('id_work', idWork);
    
            invoicejs.getLastIdInvoice(function (id_invoice) {
                var lastIdInvoice = id_invoice;
                var newIdInvoice = parseInt(lastIdInvoice) + 1;
                var idLenght = newIdInvoice.toString.length;
                newIdInvoice = newIdInvoice.toString();
    
                if (idLenght == 1) {
                    newIdInvoice = "000" + newIdInvoice;
                } else if (idLenght == 2) {
                    newIdInvoice = "00" + newIdInvoice;
                } else if (idLenght == 3) {
                    newIdInvoice = "0" + newIdInvoice;
                }
                $('#invoice-id').val(newIdInvoice);
            });                                 
    
            invoicejs.getInvoice(idWork, function (invoice) {
                var invoiceData = invoice;
                var source = $('#invoice-form');             
    
                if (invoiceData.length > 0) {
                    $('#invoice-done').show();
                    numInvoiceProducts = invoiceData.length;
    
                    for (var p = 0; p<invoiceData.length; p++) {
                        var clone = source.clone();
                        var formIdConcept = clone.find(':input')[0].id;
                        var formIdUnits = clone.find(':input')[1].id;
                        var formIdBase = clone.find(':input')[2].id;
                        clone.find(':input')[3].id = invoiceData[p]['_id'];
                        clone.find(':input')[3].name = p;
    
                        if (p == 0) {
                            $('#invoice-id').val(invoiceData[p]['id_invoice']);
                            $('#invoice-iva').val(invoiceData[p]['iva']);
                        }
    
                        clone.find(':input')[0].id = formIdConcept + p;
                        clone.find(':input')[0].value = invoiceData[p]['concept'];
    
                        clone.find(':input')[1].id = formIdUnits + p;
                        clone.find(':input')[1].value = invoiceData[p]['units'];
    
                        clone.find(':input')[2].id = formIdBase + p;
                        clone.find(':input')[2].value = invoiceData[p]['base'];
                        clone.attr('name', "invoice-form" + p);
                        clone.show();
                        clone.insertBefore(source);
    
                        invoicejs.refreshListenerInvoice();
                        source.hide();
                    }
                } else {
                    $('#invoice-done').hide();
                    source.show();
                }
    
                (function() {
                    var count = numInvoiceProducts;
    
                    $('.btn-add-product-invoice').on('click', function() {
    
                        var source = $('#invoice-form'),
                            clone = source.clone();
                        
                        if (!source) {
                            var source = $('#invoice-form0'),
                            clone = source.clone();
                        }
    
                        clone.find(':input').attr('id', function(i, val) {
                            if (!isNaN(parseInt(val.slice(-1)))){
                                return val.substr(0, val.length - 1) + count;
                            } else {
                                return val + count;
                            } 
                        });
    
                        clone.find(':input')[0].value = "";
                        clone.find(':input')[1].value = "";
                        clone.find(':input')[2].value = "";
                        clone.find(':input')[3].id = "";
                        clone.find(':input')[3].name = count;
    
                        clone.attr('name', "invoice-form" + count);
                        clone.insertBefore(this);
                        count++;
    
                        invoicejs.refreshListenerInvoice();
    
                    });
    
                })();
            });   
        });

        /**
         *  Budget functionality
         */

        var numBudgetProducts = 0;

        $('.btn-open-budget').on('click', function() {
            var id = this.id;
            id = id.replace('btn-open-budget-', '');
            var idWork = workData[id]['_id']
            $('#id-work-budget').val(idWork);
            localStorage.setItem('id_work', idWork);

            budgetjs.getLastIdBudget(function (id_budget) {
                var lastIdBudget = id_budget;
                var newIdBudget = parseInt(lastIdBudget) + 1;
                var idLenght = newIdBudget.toString.length;
                newIdBudget = newIdBudget.toString();

                if (idLenght == 1) {
                    newIdBudget = "000" + newIdBudget;
                } else if (idLenght == 2) {
                    newIdBudget = "00" + newIdBudget;
                } else if (idLenght == 3) {
                    newIdBudget = "0" + newIdBudget;
                }
                $('#budget-id').val(newIdBudget);
            });                                 

            budgetjs.getBudget(idWork, function (budget) {
                var budgetData = budget;
                var source = $('#budget-form');             

                if (budgetData.length > 0) {

                    $('#budget-done').show();
                    numBudgetProducts = budgetData.length;

                    for (var p = 0; p<budgetData.length; p++) {
                        var clone = source.clone();
                        var formIdConcept = clone.find(':input')[0].id;
                        var formIdUnits = clone.find(':input')[1].id;
                        var formIdBase = clone.find(':input')[2].id;
                        clone.find(':input')[3].id = budgetData[p]['_id'];
                        clone.find(':input')[3].name = p;

                        if (p == 0) {
                            $('#budget-id').val(budgetData[p]['id_budget']);
                            $('#budget-iva').val(budgetData[p]['iva']);
                        }

                        clone.find(':input')[0].id = formIdConcept + p;
                        clone.find(':input')[0].value = budgetData[p]['concept'];

                        clone.find(':input')[1].id = formIdUnits + p;
                        clone.find(':input')[1].value = budgetData[p]['units'];

                        clone.find(':input')[2].id = formIdBase + p;
                        clone.find(':input')[2].value = budgetData[p]['base'];
                        clone.attr('name', "budget-form" + p);
                        clone.show();
                        clone.insertBefore(source);

                        budgetjs.refreshListenerBudget();
                        source.hide();

                    }
                } else {
                    $('#budget-done').hide();
                    source.show();
                }

                (function() {
                    var count = numBudgetProducts;

                    $('.btn-add-product-budget').on('click', function() {

                        var source = $('#budget-form'),
                            clone = source.clone();
                        
                        if (!source) {
                            var source = $('#budget-form0'),
                            clone = source.clone();
                        }

                        clone.find(':input').attr('id', function(i, val) {
                            if (!isNaN(parseInt(val.slice(-1)))){
                                return val.substr(0, val.length - 1) + count;
                            } else {
                                return val + count;
                            } 
                        });

                        clone.find(':input')[0].value = "";
                        clone.find(':input')[1].value = "";
                        clone.find(':input')[2].value = "";
                        clone.find(':input')[3].id = "";
                        clone.find(':input')[3].name = count;

                        clone.attr('name', "budget-form" + count);
                        clone.insertBefore(this);
                        count++;

                        budgetjs.refreshListenerBudget();

                    });

                })();
            });   
        });
    });

    $('#datepicker-work-new').datepicker({
        language: 'es'                   
    });
    $('#datepicker-work-new').datepicker().datepicker('setDate', new Date().toLocaleDateString("es"));
    $('.fa-calendar').click(function() {
        $('#datepicker-work-new').focus();
    });


    var spans = document.querySelectorAll('#span-cal');
    spans.forEach(function(span) {
        span.addEventListener('click', function() {
            var postId = this.getAttribute('post-id');
            document.getElementById('datepicker-work-edit-' + postId).focus();
        });
    });

    $('.delete-customer').on('click', function() {
        var result = confirm('¿Está seguro que quiere borrar este cliente y su historial?');
        if (result) {
            deleteCustomer(idCustomer);
        }
    });

    $('#invoiceModal').on("hidden.bs.modal", function () {
        $('form[name^="invoice-form"]').remove();
    });

    $('.btn-create-invoice').on('click', function() {
        var idWork = $('#id-work-invoice').val();

        invoicejs.insertInvoice(idWork);
    });

    invoicejs.refreshListenerInvoice();

             
    $('#budgetModal').on("hidden.bs.modal", function () {
        $('form[name^="budget-form"]').remove();
    });

    $('.btn-create-budget').on('click', function() {
        var idWork = $('#id-work-budget').val();

        budgetjs.insertBudget(idWork);
    });
 
    budgetjs.refreshListenerBudget();
});
