let floater = document.getElementById("floater");
let floatDefualtIndex = app.getCSSProp("z-index", floater);
let floatDefualtBottom = app.getCSSProp("bottom", floater);
let floatDefualtRight = app.getCSSProp("right", floater);

function handleFloaterClick() {
  document.querySelector(".form-display").style.display = "block";
  floater.style.display = "none";
  floater.style.borderRadius = "29px";
  floater.style.animationDelay = "0ms";
  document.querySelector(".form-display").onanimationend = function() {
    setTimeout(function() {
      floater.style.display = "block";
    }, 500);
  };
  floater.style.zIndex = floatDefualtIndex + 100;
  floater.style.bottom = "30px";
  floater.style.right = "30px";
  floater.innerHTML = "<p>Next</p>";

  floater.onclick = function() {
    let titleInp = document.getElementById("title");
    if (titleInp.value) {
      var form = document.querySelector(".form");
      anime
        .timeline({
          loop: false,
        })
        .add({
          targets: form.querySelectorAll("*"),
          translateY: ["0px", "-50%"],
          opacity: [1, 0],
          delay: (el, i) => i * 200,
          duration: 850,
          complete: function() {
            form.innerHTML = notificationUI.createForm(
              "Enter description for notification",
              notificationUI.createInput("des", true).setAttributes({
                placeholder: "Enter Description",
              })
            );
            anime.set({
              targets: form.querySelectorAll("*"),
              translateY: 0,
              opacity: 1,
            });

            floater.onclick = function() {
              let desInp = document.getElementById("des");
              if (desInp.value) {
                var form = document.querySelector(".form");
                anime
                  .timeline({
                    loop: false,
                  })
                  .add({
                    targets: form.querySelectorAll("*"),
                    translateY: ["0px", "-50%"],
                    opacity: [1, 0],
                    delay: (el, i) => i * 200,
                    duration: 850,
                    complete: function() {
                      let optionsStr = "";
                      let optData = [
                        {
                          value: "inf",
                          label: "Information",
                        },
                        {
                          value: "pay",
                          label: "About Payment",
                        },
                        {
                          value: "req",
                          label: "Request",
                        },
                        {
                          value: "war",
                          label: "Warning",
                        },
                        {
                          value: "err",
                          label: "Error",
                        },
                        {
                          value: "evnt",
                          label: "Events",
                        },
                        {
                          value: "emr",
                          label: "Emergency",
                        },
                      ];

                      optData.forEach((option) => {
                        optionsStr += `<option value="${option.value}">${option.label}</option>`;
                      });

                      let selectStr = new TagString("<select></select>")
                        .setOptions({
                          id: "cate",
                          name: "cate",
                        })
                        .child(optionsStr);

                      form.innerHTML = notificationUI.createForm(
                        "Choose an Category",
                        selectStr
                      );
                      anime.set({
                        targets: form.querySelectorAll("*"),
                        translateY: 0,
                        opacity: 1,
                      });

                      floater.onclick = function() {
                        let cateInp = document.getElementById("cate");

                        if (cate.value) {
                          let modalDivId;

                          modal.alert(
                            "Select user to send",
                            (divId, buttonId) => {

                              modalDivId = divId
                              bushido.getCollection('accounts').then(function(snapshot) {
                                var arr = bushido.toData(snapshot);


                                let dataToSend = {
                                  title: titleInp.value,
                                  des: desInp.value,
                                  type: cateInp.value,
                                  users: [],
                                  global: false,
                                  usersObjArr: []
                                }

                                var elem = document.getElementById(divId).querySelector(
                                  '.modal-body');
                                let listOpt = ([{
                                  inputId: 'sall',
                                  title: 'Select All',
                                  subtitle: 'Send to all users',
                                  attr: {},
                                  value: 'ALL_USER',
                                  avatar: (app.avatarUrl('AU',
                                    'initials', '&radius=40'))
                                    }]).concat(arr.map((data) => {
                                  let v = data.data();
                                  if (!v.isAdmin) {
                                    dataToSend.users.push(v.phone);
                                    dataToSend.usersObjArr.push(v);

                                    return {
                                      inputId: v.id,
                                      title: v.fullname,
                                      subtitle: v.email,
                                      attr: {},
                                      value: v,
                                      avatar: (v.avatar ? v.avatar : app.avatarUrl(v
                                        .fullname,
                                        'initials', '&radius=40'))
                                    }
                                  }
                                }));



                                modal.optionsPicker(
                                  listOpt.filter(Boolean),
                                  false, userboxUI.create(
                                    "#(title)",
                                    "#(subtitle)",
                                    "#(avatar)",
                                    userboxUI.input("#(inputId)")), 'Select users to send').then((
                                  users) => {
                                  dataToSend.global = true;


                                  if (!users.includes('ALL_USER')) {
                                    dataToSend.users = users.map((u) => u.phone);
                                    dataToSend.global = false;
                                    dataToSend.usersObjArr = users;
                                  }

                                  
                                  if (typeof onformend == 'function') { onformend(dataToSend) }
                                  document.getElementById(buttonId).click();
                                })

                                /*arr.forEach(function(item, index) {
                                  var data = item.data();
                                  var userItemElem = 7. parseElement()[0];


                                  elem.appendChild(userItemElem);
                                  var inpEl =
                                    document.querySelector("#" + divId + "_INP")
                                  inpEl.onchange = function() {
                                    if (inpEl.checked) {
                                      userList[data.email] = data;
                                    } else {
                                      delete userList[data.email]
                                    }
                                  }
                                })*/





                              })
                              return '<center><img src="../../assets/spinner/ring-resize.svg" class="svg-mini-loader loader-x2"></img><p id="loaderlog">Connecting...</p></center>'
                            },
                            ""
                          );
                        }
                      };
                    },
                  });
              }
            };
          },
        });
    } else {
      modal.alert("Input Blank", "Title input is blank");
    }
  };
};

floater.onclick = handleFloaterClick;