app.validUser().catch(() => {
  app.redirectWithPreloader("../register");
});

function onpageloadin() {
  document.querySelector(".body").innerHTML = "";
  messenger.reciveMessages();
}

dayjs.extend(window.dayjs_plugin_relativeTime);

class Message {
  constructor(
    userid,
    msg,
    status,
    name,
    email,
    phone,
    msgID = false,
    extraData = {}
  ) {
    this.message_id = msgID ? msgID : messenger.id();
    // convert commented data into contructor
    this.user_id = userid;
    this.message = msg;
    this.date = new Date().toString();
    this.status = status;
    this.user_name = name;
    this.email = email;
    this.phone = phone;
    this.type = "msg";
    this.extraData = extraData;
  }

  modify(key, value) {
    var newOne = new Message(
      this.user_id,
      this.message,
      this.status,
      this.user_name,
      this.email,
      this.phone,
      this.message_id,
      this.extraData
    );
    newOne[key] = value;
    return newOne;
  }

  export() {
    return {
      message_id: this.message_id,
      user_id: this.user_id,
      message: this.message,
      date: this.date,
      status: this.status,
      user_name: this.user_name,
      email: this.email,
      phone: this.phone,
      type: this.type,
      extraData: this.extraData,
    };
  }
}

// {
//   message_id: messenger.id(),
//   user_id: data.id,
//   message: msg,
//   date: new Date(),
//   status: "unseen",
//   user_name: data.fullname,
//   email: data.email,
//   phone: data.phone,
//   type: 'msg'
// }

const messenger = {
  message_started: false,
  room_id: "common_room_34",
  is_first_time: localStorage.getItem("is_first_time"),
  before_send_by: null,
  before_send_time: null,
  before_send_msg: null,
  id() {
    return (
      "CLI_MSG_" +
      Math.floor(Math.random() * 999999) +
      "_" +
      Math.floor(Math.random() * 999999)
    );
  },
  join() {
    return new Promise((resolve, reject) => {
      app.validUser().then((user) => {
        if (user.id) {
          bushido.realtime.get("chat/" + user.id).then(function (snapshot) {
            if (!snapshot.exists()) {
              var data = user;
              bushido.realtime
                .set("chat/" + user.id, {
                  messages: [],
                  unseen_messages: [],
                  last_message: {},
                  date: new Date(),
                  user_id: data.id,
                  user_name: data.fullname,
                  email: data.email,
                  phone: data.phone,
                })
                .then((r) => resolve(true));
            } else {
              resolve(false);
            }
          });
        }
      });
    });
  },
  send(msg, id, extraData) {
    localStorage.setItem("is_first_time", false);
    this.is_first_time = false;
    return new Promise((resolve, reject) => {
      app
        .validUser()
        .then((data) => {
          if (data.id) {
            const msgID = id ? id : messenger.id();
            const messageModal = new Message(
              data.id,
              msg,
              "unseen",
              data.fullname,
              data.email,
              data.phone,
              msgID,
              extraData
            );

            if (
              messageModal.extraData.link &&
              messageModal.extraData.linkText
            ) {
              messageModal.extraData.linkText =
                messageModal.extraData.linkText.slice(0, 70) + "...";
            }

            var promises = [
              bushido.realtime.set(
                "chat/" + data.id + "/messages/" + msgID,
                function () {
                  return messageModal.export();
                }
              ),
              bushido.realtime.set(
                "chat/" + data.id + "/unseen_messages/" + msgID,
                function () {
                  return messageModal.export();
                }
              ),
              bushido.realtime.set(
                "chat/" + data.id + "/last_message",
                function () {
                  return messageModal.export();
                }
              ),
              bushido.realtime.set("chat/" + data.id + "/date", function () {
                return messageModal.date;
              }),
            ];

            Promise.all(promises).then(resolve).catch(reject);
          }
        })
        .catch(reject);
    });
  },
  openPanel(code_to_run) {
    return new Promise((resolve, reject) => {
      app.validUser().then((data) => {
        if (data.id) {
          code_to_run(resolve, data);
        }
      });
    });
  },
  sendBreaker(breaker_message, id) {
    app.validUser().then((data) => {
      if (data.id) {
        return new Promise((resolve, reject) => {
          const msgID = id ? id : messenger.id() + "__BRKR";
          const messageModal = {
            message_id: msgID,
            date: new Date(),
            message: breaker_message,
            type: "breaker",
            status: "NO_STATUS",
          };

          var promises = [
            bushido.realtime.set(
              "chat/" + data.id + "/messages/" + msgID,
              function () {
                return messageModal;
              }
            ),
            bushido.realtime.set("chat/" + data.id + "/date", function () {
              return messageModal.date;
            }),
          ];

          Promise.all(promises).then(resolve).catch(reject);
        });
      }
    });
  },
  reciveMessages() {
    app
      .validUser()
      .then(function (data) {
        bushido.realtime.onSet(
          "chat/" + data.id,
          (snapshot) => {
            if (snapshot.exists()) {
              var msgData = snapshot.val();
              if (msgData.messages && msgData.unseen_messages) {
                var msg = msgData.unseen_messages;

                messenger.message_started = true;
                var sortedArr = Object.entries(msgData.messages).sort(
                  (a, b) => {
                    var extA = a[1].date;
                    var extB = b[1].date;
                    const dateA = new Date(extA);
                    const dateB = new Date(extB);

                    return dateB - dateA;
                  }
                );

                sortedArr.reverse().forEach((item, index) => {
                  var item = item[1];
                  messenger.addToBody(item, data);
                  if (
                    item.email == "bushidosupport@gmail.com" ||
                    item.email != data.email
                  ) {
                    bushido.realtime.set(
                      `chat/${data.id}/messages/${item.message_id}/status`,
                      "seen"
                    );
                  }
                });

                document.querySelector("html").scrollTop += 9999999;
              }
            } else {
              if (
                messenger.is_first_time == true ||
                messenger.message_started == false
              ) {
                messenger.join().then(function () {
                  alert();
                });
                messenger.send("hi, i am using this software...");
                messenger.is_first_time = false;
              } else {
                modal.alert(
                  "Something went wrong.!",
                  "check your internet connection"
                );
              }
            }
          },
          "doc"
        );
      })
      .catch(() => {});
  },
  addMessage() {},
  structure: {
    createBubble(
      username,
      chat_ID,
      profileIMG,
      msgText,
      sendTime,
      infoAboutMessage,
      icon,
      isRight = false,
      isNextMsg = false,
      extraData = {}
    ) {
      return new TagString(`
                <div class="chat-layout ${
                  isNextMsg ? "next-chat" : ""
                }" id="${chat_ID}">
      <div class="chat-container ${isRight ? "right-item" : ""}">
        <div class="chat-img">
          <img src="${profileIMG}" alt="">
        </div>
        <div class="chat-bubble">
            ${
              extraData.link && extraData.linkText
                ? `<a href="${extraData.link}" class="chat-linked">
              ${extraData.linkText}
            </a>`
                : ""
            }
          <b>${username}</b>
          <p>${msgText}</p>
          <div class="time" ${
            sendTime ? sendTime : 'style="display: none"'
          }>${sendTime}</div>
          <div class="info-chat">${infoAboutMessage}</div>
        </div>
        <div class="icon-chat"  ${icon ? icon : 'style="display: none"'}>
          <i class="eva eva-${icon}"></i>
        </div>
      </div>
    </div>
            `);
    },
    createBreaker(text, id) {
      return new TagString(`<div class="chat-layout breaker-layout" id="${id}">
  <div class="breaker">${text}</div>
</div>`);
    },
  },
  addToBody(msg, data, icon = "checkmark", infoAboutMessage = "") {
    //console.log(msg.email, messenger.before_send_by);

    let isMe =
      msg.email == data.email || msg.id == data.id || msg.phone == data.phone;
    let formattedTime = dayjs(new Date(msg.date)).format("hh:mm A");

    // console.log(msg.extraData);

    let msgElem = null;
    if (msg.type === "breaker") {
      msgElem = messenger.structure
        .createBreaker(msg.message, msg.message_id)
        .parseElement()[0];
    } else {
      msgElem = messenger.structure
        .createBubble(
          msg.user_name,
          msg.message_id,
          app.avatarUrl(msg.user_name),
          msg.message,
          formattedTime == messenger.before_send_time ? "" : formattedTime,
          infoAboutMessage,
          msg.status == "unseen" ? "checkmark" : "done-all",
          isMe,
          messenger.before_send_by == msg.email,
          msg.extraData
        )
        .parseElement()[0];
    }

    function dateFormat(date) {
      return dayjs(date).format("DD-MM-YYYY");
    }

    function addBr(id, textDate) {
      if (!document.getElementById(id)) {
        document
          .querySelector(".body")
          .appendChild(
            messenger.structure
              .createBreaker(dayjs(textDate).fromNow(), id)
              .parseElement()[0]
          );
      }
    }

    let id = dateFormat(msg.date);
    addBr(id, msg.date);

    if (document.getElementById(msg.message_id)) {
      document.getElementById(msg.message_id).innerHTML = msgElem.innerHTML;
    } else {
      document.querySelector(".body").appendChild(msgElem);
    }

    messenger.before_send_by = msg.email;
    messenger.before_send_time = formattedTime;
    messenger.before_send_msg = msg;
  },
};

var userData = {};

app
  .validUser()
  .then((data) => {
    userData = data;
    if (data.id) {
      messenger.is_first_time;
    }
  })
  .catch((err) => {
    app.redirectWithPreloader("../");
  });

if (document.getElementById("sendBtn")) {
  document.getElementById("sendBtn").onclick = function () {
    document.getElementById("sendBtn").focus();
    var inputValue = document.getElementById("chatInp").value;
    document.getElementById("chatInp").value = "";

    if (inputValue) {
      var id = messenger.id();
      let msg = new Message(
        userData.id,
        inputValue,
        "sending",
        userData.fullname,
        userData.email,
        userData.phone,
        id
      );
      let formattedTime = dayjs(new Date(msg.date)).format("hh:mm A");

      document
        .querySelector(".body")
        .appendChild(
          messenger.structure
            .createBubble(
              msg.user_name,
              msg.message_id,
              app.avatarUrl(msg.user_name),
              msg.message,
              formattedTime == messenger.before_send_time ? "" : formattedTime,
              "sending...",
              "clock-outline",
              true,
              messenger.before_send_by == msg.email
            )
            .parseElement()[0]
        );

      messenger.send(inputValue, id).then(function () {
        document.getElementById("sendBtn").disabled = false;
      });
    }
  };
}
