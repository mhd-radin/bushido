function onpageloadin() {
  dayjs.extend(window.dayjs_plugin_weekday)

  var attendanceData = [

        ]
  let currentDate = dayjs().format('DD-MM-YYYY');
  let dateInp = document.getElementById('date');
  dateInp.value = dayjs().format('YYYY-MM-DD');

  dateInp.onchange = function(param) {
    console.log(dateInp.value)
    var dt = dayjs(dateInp.value).format('DD-MM-YYYY');
    if (!app.isDate1Later(dt, dayjs().format('DD-MM-YYYY'))) {
      currentDate = dt;
    } else {
      modal.alert('Invalid Date Used!', 'selected date too early. check and confirm', '');
      dateInp.value = dayjs().format('YYYY-MM-DD');
    }
  }

  bushido.getCollection('accounts').then(function(snapshot) {
    var arr = bushido.toData(snapshot)
    var elem = document.querySelector('.card-box-body#userslist');
    elem.innerHTML = ''
    arr.forEach(function(item, index) {
      var data = item.data();
      elem.appendChild(userboxUI.create(
        data.fullname,
        (data.isAdmin == true ? 'Special Access' : data.email),
        'https://api.dicebear.com/9.x/initials/svg?seed=' + data.fullname + '&radius=40',
        (data.isAdmin == true ? userboxUI.tag('Admin') : userboxUI.input(item.id))).setOptions({
        id: item.id
      }).parseElement()[0])
    })

    document.getElementById('userTotalInfo').innerHTML = 'no one registered ( Total: ' + arr.length + ', Registered: 0 )'
  });


  document.getElementById('updateBtn').onclick = function() {
    document.querySelector(".svg-mini-loader").style.display = 'block'

    attendanceData = []
    document.querySelectorAll('.user-box').forEach(function(elem) {
      var input = elem.querySelector('input[type="checkbox"]');
      if (input && input.checked == true) {
        attendanceData.push({
          id: elem.id,
          value: input.checked,
          date: currentDate,
        })
      }
    })

    bushido.set('attendance/' + currentDate, { users: attendanceData })
  }

  bushido.onSet('attendance', function(snapshot) {
    var arr = bushido.toData(snapshot);
    arr.sort((a, b) => {
      const [dayA, monthA, yearA] = a.id.split('-').map(Number);
      const [dayB, monthB, yearB] = b.id.split('-').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      return dateB - dateA;
    });
    var dates = arr.slice(0, 7);
    let selectedDates = [];
    let days = [];
    let attendanceDataLength = [];

    function zeroPush() {
      selectedDates.push(null);
      attendanceDataLength.push(0)
    }

    for (var i = 0; i < 7; i++) {
      var day = dayjs().subtract((i), 'day');
      var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sta'];

      days.push(week[day.day()]);
      var isPushed = false;


      dates.forEach((date, index) => {
        if (
          (date.id.match(/\W/g) && date.data().users)) {
          if (day.format('DD-MM-YYYY') == date.id || i == 0 && isPushed == false) {
            selectedDates.push(date.id);
            if (i == 0) console.log(date.data().users.length);
            attendanceDataLength.push(date.data().users.length);
            isPushed = true;
          }
        }
      });

      if (isPushed == false) {
        zeroPush();
      }

    }

    if (selectedDates.length > 0) {
      attendanceChartUp.data.labels = days.reverse();
      attendanceChartUp.data.datasets[0].data = attendanceDataLength.reverse();
      attendanceChartUp.update();
    }
  }, 'collection')

  const ctx = document.getElementById('attendanceChart').getContext('2d');
  let attendanceChartUp = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Months
      datasets: [{
        label: 'Attendance per Day',
        data: [], // Attendance data
        borderColor: app.getCSSProp('--theme-color'),
        backgroundColor: app.getCSSProp('--theme-color') + '50',
        fill: true,
        tension: 0.2,
        color: app.getCSSProp('--color')
          }]
    },
    options: {
      responsive: true,
      color: app.getCSSProp('--color'),
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: function(context) {
              var index = context.tick.index;
              if (index == (context.chart.data.labels.length - 1)) {
                return app.getCSSProp('--spinner-one');
              } else {
                return app.getCSSProp('--theme-color');
              }
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Presented',
            color: app.getCSSProp('--color')
          },
          ticks: {
            color: app.getCSSProp('--color')
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return `Attendance: ${tooltipItem.raw}`;
            }
          }
        }
      }
    }
  });
}


document.querySelector(".svg-mini-loader").style.display = 'none'
