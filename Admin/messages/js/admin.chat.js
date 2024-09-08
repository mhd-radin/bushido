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

  export () {
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
  current_user_data: null,
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
  send(msg, userData) {
    var data = userData;
    localStorage.setItem("is_first_time", true);
    this.is_first_time = true;
    return new Promise((resolve, reject) => {
      if (data.id) {
        const msgID = messanger.id();
        const messageModal = new Message(
          data.id,
          msg,
          "unseen",
          'Bushido Team',
          'bushidosupport@gmail.com',
          '+9112345678',
          msgID
        );

        var promises = [bushido.realtime
              .set(
            "chat/" + data.id + '/messages/' + msgID,
            function() {
              return messageModal.export();
            },
          ), bushido.realtime
                .set(
            "chat/" + data.id + '/unseen_messages/' + msgID,
            function() {
              return messageModal.export();
            },
          ), bushido.realtime
                .set(
            "chat/" + data.id + '/last_message',
            function() {
              return messageModal.export();
            },
          ), bushido.realtime
                  .set(
            "chat/" + data.id + '/date',
            function() {
              return messageModal.date;
            },
          )];

        Promise.all(promises).then(resolve).catch(reject)

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
  sendBreaker(breaker_message) {},
  reciveMessages(data) {
    data.id = data.user_id;
    data.fullname = data.user_name;

    document.querySelector('.body').innerHTML = ''
    bushido.realtime.onSet(
      "chat/" + data.id,
      (snapshot) => {
        if (snapshot.exists()) {
          var msgData = snapshot.val();
          console.log(msgData)
          var msg = msgData.unseen_messages;

          messanger.message_started = true;
          var sortedArr = Object.entries(msgData.messages).sort((a, b) => {
            var extA = a[1].date;
            var extB = b[1].date;
            console.log('dt', extA, a)
            const dateA = new Date(extA);
            const dateB = new Date(extB);
          
            return dateB - dateA;
          });
          
          sortedArr.reverse().forEach((item, index) => {
            console.log(item)
            var item = item[1];
            messanger.addToBody(item, data);
            if (item.email != 'bushidosupport@gmail.com' || item.email === data.email) {
              bushido.realtime.set(`chat/${data.id}/messages/${item.messsage_id}/status`, 'seen')
            }
          });
          document.querySelector("html").scrollTop += 9999999;
        }
        else {
          if (!messanger.is_first_time && !messanger.message_started) {

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
      msg.email == 'bushidosupport@gmail.com' || msg.phone == '+9112345678';
    let formattedTime = dayjs(new Date(msg.date)).format("hh:mm A");

    const msgElem = messanger.structure
      .createBubble(
        msg.user_name,
        msg.messsage_id,
        app.avatarUrl(msg.user_name),
        msg.message,
        formattedTime == messanger.before_send_time ? "" : formattedTime,
        infoAboutMessage,
        msg.status == 'unseen' ? 'checkmark' : 'done-all',
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

function handleItemClick(data) {
  messanger.current_user_data = data;

  if (window.innerWidth < 650) {
    document.querySelector('.users-list').style.display = 'none';
    document.querySelector('.body').style.display = 'block';
    document.querySelector('.footer').style.display = 'block';
    document.scrollingElement.scrollTop = 0;
  }
}

bushido.onSet('chat', function(snapshot) {
  var arr = bushido.toData(snapshot)
  var elem = document.querySelector('.users-list');
  elem.innerHTML = ''
  arr.forEach(function(item, index) {
    var data = item.data();

    if (!data.isAdmin) {
      var userItemElem = userboxUI.create(
        data.user_name,
        data.email,
        'https://api.dicebear.com/9.x/initials/svg?seed=' + data.user_name + '&radius=40',
        (data.isAdmin == true ? userboxUI.tag('Admin') : '')).parseElement()[0];
      elem.appendChild(userItemElem);

      userItemElem.onclick = function() {
        document.querySelectorAll('.user-box-active').forEach(function(el) {
          el.classList.remove('user-box-active')
        });
        userItemElem.classList.add('user-box-active');
        handleItemClick(data)
        messanger.reciveMessages(data)
      }
    }
  })
}, 'collection')


document.getElementById("sendBtn").onclick = function() {
  document.getElementById("sendBtn").disabled = true;
  var inputValue = document.getElementById("chatInp").value;
  if (inputValue && messanger.current_user_data) {
    messanger.send(inputValue, messanger.current_user_data).then(function() {
      document.getElementById("chatInp").value = "";
      document.getElementById("sendBtn").disabled = false;
    });
  }
};