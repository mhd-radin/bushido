let floater = document.getElementById("floater");
let floatDefualtIndex = app.getCSSProp("z-index", floater);
let floatDefualtBottom = app.getCSSProp("bottom", floater);
let floatDefualtRight = app.getCSSProp("right", floater);

function handleFloaterClick() {
  document.querySelector(".form-display").style.display = "block";
  floater.style.display = "none";
  floater.style.animationDelay = "0ms";
  document.querySelector(".form-display").onanimationend = function () {
    setTimeout(function () {
      floater.style.display = "block";
    }, 500);
  };
  floater.style.zIndex = floatDefualtIndex + 100;
  floater.style.bottom = "30px";
  floater.style.right = "30px";
  floater.innerHTML = "<p>Next</p>";

  floater.onclick = function () {
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
          complete: function () {
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

            floater.onclick = function () {
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
                    complete: function () {
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

                      floater.onclick = function () {
                        let cateInp = document.getElementById("cate");
                        if (cate.value) {
                          modal.alert(
                            "Select user to send",
                            () => {
                              return userboxUI.create(
                                "Name",
                                "subname",
                                "https://api.dicebear.com/9.x/shapes/svg?seed=Bjrt&radius=50&size=58",
                                userboxUI.input("648")
                              );
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