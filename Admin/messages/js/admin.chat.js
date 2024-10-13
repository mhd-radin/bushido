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
  current_user_data: null,
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
  send(msg, userData, id, extraData) {
    var data = userData;
    localStorage.setItem("is_first_time", true);
    this.is_first_time = true;
    return new Promise((resolve, reject) => {
      if (data.id) {
        const msgID = id ? id : messenger.id();
        const messageModal = new Message(
          data.id,
          msg,
          "unseen",
          "Bushido Team",
          "bushidosupport@gmail.com",
          "+9112345678",
          msgID,
          extraData
        );

        if (messageModal.extraData.link && messageModal.extraData.linkText) {
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
  reciveMessages(data) {
    data.id = data.user_id;
    data.fullname = data.user_name;

    document.querySelector(".body").innerHTML = "";
    bushido.realtime.onSet(
      "chat/" + data.id,
      (snapshot) => {
        if (snapshot.exists()) {
          var msgData = snapshot.val();
          var msg = msgData.unseen_messages;

          messenger.message_started = true;
          var sortedArr = Object.entries(msgData.messages).sort((a, b) => {
            var extA = a[1].date;
            var extB = b[1].date;
            const dateA = new Date(extA);
            const dateB = new Date(extB);

            return dateB - dateA;
          });

          sortedArr.reverse().forEach((item, index) => {
            var item = item[1];
            messenger.addToBody(item, data);
            if (
              item.email != "bushidosupport@gmail.com" ||
              item.email === data.email
            ) {
              bushido.realtime.set(
                `chat/${data.id}/messages/${item.message_id}/status`,
                "seen"
              );
            }
          });
          document.querySelector("html").scrollTop += 9999999;
        } else {
          if (
            messenger.is_first_time == true ||
            messenger.message_started == false
          ) {
          } else {
            modal.alert(
              "Something went wrong.!",
              "no data found!. check your internet connection"
            );
          }
        }
      },
      "doc"
    );
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
          typeof extraData != "undefined" &&
          extraData.link &&
          extraData.linkText
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
    let isMe =
      msg.email == "bushidosupport@gmail.com" || msg.phone == "+9112345678";
    let formattedTime = dayjs(new Date(msg.date)).format("hh:mm A");

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

function handleItemClick(data) {
  messenger.current_user_data = data;

  if (window.innerWidth < 650) {
    document.querySelector(".users-list").style.display = "none";
    document.querySelector(".body").style.display = "block";
    document.querySelector(".footer").style.display = "block";
    document.scrollingElement.scrollTop = 0;
  }
}

bushido.realtime.onSet(
  "chat",
  function (snapshot) {
    //var arr = bushido.toData(snapshot)
    var arr = [];
    var obj = snapshot.val();
    Object.keys(obj).forEach(function (key) {
      arr.push(obj[key]);
    });
    var elem = document.querySelector(".users-list");
    elem.innerHTML = "";
    arr.forEach(function (item, index) {
      var data = item;
      //.data();

      if (!data.isAdmin) {
        var userItemElem = userboxUI
          .create(
            data.user_name,
            data.email,
            "https://api.dicebear.com/9.x/initials/svg?seed=" +
              data.user_name +
              "&radius=40",
            data.isAdmin == true ? userboxUI.tag("Admin") : ""
          )
          .parseElement()[0];
        elem.appendChild(userItemElem);

        userItemElem.onclick = function () {
          document.querySelectorAll(".user-box-active").forEach(function (el) {
            el.classList.remove("user-box-active");
          });
          userItemElem.classList.add("user-box-active");
          handleItemClick(data);
          messenger.reciveMessages(data);
        };
      }
    });
  },
  "collection"
);

document.getElementById("sendBtn").onclick = function () {
  document.getElementById("sendBtn").disabled = true;
  var inputValue = document.getElementById("chatInp").value;
  if (inputValue && messenger.current_user_data) {
    messenger.send(inputValue, messenger.current_user_data).then(function () {
      document.getElementById("chatInp").value = "";
      document.getElementById("sendBtn").disabled = false;
    });
  }
};
