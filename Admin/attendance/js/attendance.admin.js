function onpageloadin() {
  bushido.getCollection('accounts').then(function(snapshot) {
    var arr = bushido.toData(snapshot)
    var elem = document.querySelector('.card-box-body#userslist');
    elem.innerHTML = ''
    arr.forEach(function(item, index) {
      var data = item.data();
      elem.appendChild(userboxUI.create(
        data.fullname,
        data.email,
        'https://api.dicebear.com/9.x/initials/svg?seed=' + data.fullname + '&radius=40',
        userboxUI.input(item.id)).parseElement()[0])
    })
    document.getElementById('userTotalInfo').innerHTML = 'no one registered ( Total: ' + arr.length + ', Registered: 0 )'
  })

  const ctx = document.getElementById('attendanceChart').getContext('2d');

  const attendanceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sta', 'Sun'], // Months
      datasets: [{
        label: 'Attendance per day (demo)',
        data: [5, 2, 7, 3, 7, 8, 0], // Attendance data
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3
          }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Attendance'
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