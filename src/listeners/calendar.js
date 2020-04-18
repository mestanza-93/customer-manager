var calendar = "";
var totalColors = 6;
var bgColors = {
    0: "#0275d8",
    1: "#5cb85c",
    2: "#d9534f",
    3: "#f0ad4e",
    4: "#5bc0de",
    5: "#292b2c"
}
var textColors = {
    0: "#ffffff",
    1: "#ffffff",
    2: "#ffffff",
    3: "#ffffff",
    4: "#ffffff",
    5: "#ffffff"
}


document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'bootstrap'],
        themeSystem: 'bootstrap',
        locale: 'es',
        timeZone: 'UTC',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridWeek, dayGridMonth'
        },
        eventClick:  function(event, jsEvent, view) {
            $('#modalTitle').html(event.title);
            // $('#modalBody').html(event.description);
            // $('#eventUrl').attr('href',event.url);
            $('#fullCalModal').modal();
        }
    });
    calendar.render();
});


var customersWork = [];
getAllCustomers(function (customers) {

    workjs.getAllWorks(function (works) {
        for (var c in customers) {
            for (var w in works) {
                if (customers[c]['_id'] == works[w]['id_customer']){
                    var ele = {};
                    ele['title'] = customers[c]['name'] + " " + customers[c]['lastname'];
                    ele['start'] = works[w]['date'].split('/').reverse().join('-');
                    ele['color'] = bgColors[c % totalColors];
                    ele['textColor'] = textColors[c % totalColors];
                    customersWork.push(ele);
                    calendar.addEvent(ele);
                }
            }
        }
    });  
});