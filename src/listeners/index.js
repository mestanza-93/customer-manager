$(document).ready(function () {
    var customersData = [];
        getAllCustomers(function (customers) {
            customersData = customers;

            var table = $('#customers').DataTable({
                language: {
                    "sProcessing": "Procesando...",
                    "sLengthMenu": "Mostrar _MENU_ clientes",
                    "sZeroRecords": "No se encontraron resultados",
                    "sEmptyTable": "Ningún cliente disponible en esta tabla",
                    "sInfo": "Mostrando clientes del _START_ al _END_ de un total de _TOTAL_ clientes",
                    "sInfoEmpty": "Mostrando clientes del 0 al 0 de un total de 0 clientes",
                    "sInfoFiltered": "(filtrado de un total de _MAX_ clientes)",
                    "sInfoPostFix": "",
                    "sSearch": "Buscar:",
                    "sUrl": "",
                    "sInfoThousands": ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst": "Primero",
                        "sLast": "Último",
                        "sNext": "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    },
                    "buttons": {
                        "copy": "Copiar",
                        "colvis": "Visibilidad"
                    }
                },
                data: customersData,
                columns: [
                    { data: "name" },
                    { data: "lastname" },
                    { data: "phone" },
                    { data: "dni" },
                    { data: "address" },
                    { data: "postalcode" }
                ]
            });
        
            $('#customers').on('click', 'tbody > tr > td', function () {
                var rowData = table.row(this).data();
                console.log(rowData);
                localStorage.setItem('id_customer', rowData['_id']);
                window.location.href = 'customer.html';
            });
        });
    
});