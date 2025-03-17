let notifications = [];

dayjs.extend(window.dayjs_plugin_relativeTime);

function createNotificationBox(title, des, type, time) {
  var icon = "done-all";

  switch (type) {
    case "warning":
      icon = "warning";
      break;
  }

  return new TagString(`
    <div class="notify-box">
        <div class="notify-container">
          <div class="icon">
            <i class="eva eva-${icon}-outline"></i>
          </div>
          <div class="notify-body">
          <div class="notify-head">${title}</div>
            <div class="notify-text">
            ${des}
            </div>
          </div>
          <div class="right">${time}</div>
        </div>
      </div>
    `).parseElement()[0];
}

function createBreaker(title) {
  return new TagString(`
    <div class="breaker">
        <div class="breaker-title">${title}</div>
      </div>
    `).parseElement()[0];
}

// bushido.realtime.set("notifications" + "/global", [
//   {
//     date: new Date(),
//     type: "information",
//     title: "title ...",
//     des: "des",
//   },
// ]);

app
  .validUser()
  .then((userData) => {
    var promises = [
      bushido.realtime.get("notifications/" + userData.phone),
      bushido.realtime.get("notifications/global"),
    ];

    Promise.all(promises).then(function (output) {
      output.forEach(function (snapshot) {
        var data = bushido.convertToArray(snapshot.val());
        
        if (snapshot.exists()) {
          notifications = notifications.concat(data);
        }
      });

      var sorted = notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      var prevDate = ''
      var baseElem = document.querySelector(".body");
      baseElem.innerHTML = ''
      sorted.forEach(function (data){
        var title = dayjs(data.date).fromNow();
        if (prevDate != title){
          var breaker = createBreaker(title)
          baseElem.appendChild(breaker);
        }
        prevDate = title;
        var msg = createNotificationBox(data.title, data.des, data.type, dayjs(data.date).format("hh:mm"));
        baseElem.appendChild(msg)
      })
    });
  })
  .catch(() => {
    app.redirectWithPreloader("../register");
  });
