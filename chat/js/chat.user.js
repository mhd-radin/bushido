function onpageloadin() {
  document.querySelector(".body").innerHTML = "";
  messanger.reciveMessages();
}

dayjs.extend(window.dayjs_plugin_relativeTime);

class Message {
  constructor(userid, msg, status, name, email, phone, msgID = false) {
    this.messsage_id = msgID ? msgID : messanger.id();
    // convert commented data into contructor
    this.user_id = userid;
    this.message = msg;
    this.date = new Date().toString();
    this.status = status;
    this.user_name = name;
    this.email = email;
    this.phone = phone;
    this.type = "msg";
  }

  modify(key, value) {
    var newOne = new Message(
      this.user_id,
      this.message,
      this.status,
      this.user_name,
      this.email,
      this.phone
    );
    newOne[key] = value;
    return newOne;
  }

  export() {
    return {
      messsage_id: this.messsage_id,
      user_id: this.user_id,
      message: this.message,
      date: this.date,
      status: this.status,
      user_name: this.user_name,
      email: this.email,
      phone: this.phone,
      type: this.type,
    };
  }
}

// {
//   messsage_id: messanger.id(),
//   user_id: data.id,
//   message: msg,
//   date: new Date(),
//   status: "unseen",
//   user_name: data.fullname,
//   email: data.email,
//   phone: data.phone,
//   type: 'msg'
// }

const messanger = {
  message_started: false,
  room_id: "common_room_34",
  is_first_time: localStorage.getItem("is_first_time"),
  before_send_by: null,
  before_send_time: null,
  id() {
    return (
      "CLI_MSG_" +
      Math.floor(Math.random() * 999999) +
      "_" +
      Math.floor(Math.random() * 999999)
    );
  },
  send(msg) {
    localStorage.setItem("is_first_time", true);
    this.is_first_time = true;
    return new Promise((resolve, reject) => {
      app
        .validUser()
        .then((data) => {
          if (data.id) {
            bushido
              .set(
                "chat/" + messanger.room_id,
                function () {
                  const messageModal = new Message(
                    data.id,
                    msg,
                    "unseen",
                    data.fullname,
                    data.email,
                    data.phone
                  );
                  const modifiedMessageModal = messageModal
                    .modify("status", "seen")
                    .export();

                  const arrayUnion =
                    bushido.sdk.arrayUnion(modifiedMessageModal);

                  return {
                    messages: arrayUnion,
                    unseen_message: messageModal.export(),
                    date: messageModal.date,
                    user_id: data.id,
                    user_name: data.fullname,
                    email: data.email,
                    phone: data.phone,
                  };
                },
                {
                  merge: true,
                }
              )
              .then(resolve);
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
  sendBreaker(breaker_message) {},
  reciveMessages() {
    app
      .validUser()
      .then(function (data) {
        bushido.onSet(
          "chat/" + messanger.room_id,
          //data.id,
          (snapshot) => {
            if (snapshot.exists()) {
              var msgData = snapshot.data();
              var msg = msgData.unseen_message;

              if (messanger.message_started == false) {
                messanger.message_started = true;
                msgData.messages.forEach((item, index) => {
                  messanger.addToBody(item, data);
                });
                document.querySelector("html").scrollTop += 9999999;
              }
              if (msg && msg.email) {
                messanger.addToBody(msg, data);
              }
              bushido.set(
                "chat/" + messanger.room_id,
                {
                  unseen_message: null,
                },
                {
                  merge: true,
                }
              );
            } else {
              if (!messanger.is_first_time && !messanger.message_started) {
                messanger.is_first_time = true;
                messanger.send("hi, i am using this software...");
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
      isNextMsg = false
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
  },
  addToBody(msg, data, icon = "checkmark", infoAboutMessage = "") {
    console.log(msg.email, messanger.before_send_by);
    
    let isMe =
      msg.email == data.email || msg.id == data.id || msg.phone == data.phone;
    let formattedTime = dayjs(new Date(msg.date)).format("hh:mm A");

    const msgElem = messanger.structure
      .createBubble(
        msg.user_name,
        msg.messsage_id,
        app.avatarUrl(msg.user_name),
        msg.message,
        formattedTime == messanger.before_send_time ? "" : formattedTime,
        infoAboutMessage,
        icon,
        isMe,
        messanger.before_send_by == msg.email
      )
      .parseElement()[0];

    if (document.getElementById(msg.messsage_id)) {
      document.getElementById(msg.messsage_id).innerHTML = msgElem.innerHTML;
    } else {
      document.querySelector(".body").appendChild(msgElem);
    }

    messanger.before_send_by = msg.email;
    messanger.before_send_time = formattedTime;
  },
};

app
  .validUser()
  .then((data) => {
    if (data.id) {
      bushido.set("chat/" + data.id, {
        id: "FS",
      });
    }
  })
  .catch(() => {
    app.redirectWithPreloader("../");
  });

document.getElementById("sendBtn").onclick = function () {
  document.getElementById("sendBtn").disabled = true;
  var inputValue = document.getElementById("chatInp").value;

  messanger.send(inputValue).then(function () {
    document.getElementById("chatInp").value = "";
    document.getElementById("sendBtn").disabled = false;
  });
};
