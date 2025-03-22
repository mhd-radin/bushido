const cssAnimListQuery = [
  ".reg-body h2",
  ".reg-body p",
  ".input-box label",
  ".input-icon",
  ".input-icon .eva",
  ".form input, .form textarea",
  ".right-elems",
];
const delayScaleChild = [0, 0, 1, 1, 1, 1, 1];

const baseDelayChild = [0, 200, 1200, 850, 1250, 450, 850];

const delayScale = 80;

function onpageloadin() {
  cssAnimListQuery.forEach(function(query, i) {
    var delayScalePos = delayScaleChild[i];
    var baseDelayPos = baseDelayChild[i];

    if (delayScalePos === 0) {
      var elem = document.querySelector(query);
      elem.style.animationDelay = baseDelayPos + "ms";
      elem.style.animationPlayState = "running";
    } else {
      var elems = document
        .querySelectorAll(query)
        .forEach(function(elem, eIndex) {
          var elemStyle = window.getComputedStyle(elem, null);
          var currentDelay = elemStyle.getPropertyValue("animation-delay");

          elem.style.animationDelay =
            parseInt(currentDelay.replace("s", "")) * 1000 +
            delayScale * eIndex +
            "ms";
          elem.style.animationPlayState = "running";
        });
    }
  });

  if (
    (currentFormSet.completed == true) ||
    (localStorage.getItem("form_set") &&
      JSON.parse(localStorage.getItem("form_set")).completed)
  ) {
    spinner.showPreloader(
      "you also registered on Bushido. so site will be redirect to default page"
    );
    modal
      .alert(
        "Registration found.",
        "you also registered on Bushido. so site will be redirect to default page",
        ""
      )
      .then(() => {
        setTimeout(function() {
          window.location.href =
            "../login/?email=" +
            currentFormSet.get("email") +
            "&pw=" +
            currentFormSet.get("password") +
            "&enc=true";
        }, 2000);
      });
  }

  app.validUser().then(function() {
    modal
      .alert(
        "Registration found.",
        "you also registered on Bushido. so site will be redirect to default page",
        ""
      )
      .then(() => {
        window.location.href = '../events';
      })
  }).catch((err) => {})

  //menu.close(document.querySelector('.menubox .menu-item'), 'preview')
}

const formsID = ["form_1", "form_2", "form_3", "form_4"];

class FormSet {
  constructor(state = formsID[0], data = { phone: "+91" }, completed = false) {
    this.state = state;
    this.data = data;
    if (!this.data.phone) {
      this.set("phone", "+91");
    }
    if (!this.data.isAdmin) {
      this.set("isAdmin", false);
    }
    if (!this.data.isPermanent) {
      this.set("isPermanent", false);
    }
    this.completed = completed;
  }

  set(key, name) {
    this.data[key] = name;

    if (key == 'fullname') this.set('avatar', app.avatarUrl(name, 'initials', '&radius=50'))
  }

  get(key) {
    return this.data[key];
  }

  index() {
    if (formsID) {
      return formsID.indexOf(this.state);
    }
  }
}

let currentFormSet = new FormSet(formsID[0], {});

if (localStorage.getItem("form_set")) {
  var currentForm = JSON.parse(localStorage.getItem("form_set"));
  currentFormSet = new FormSet(
    currentForm.state,
    currentForm.data,
    currentFormSet.completed
  );
}

showForm(document.getElementById(currentFormSet.state));

document.querySelectorAll("input, textarea, select").forEach((input, index) => {
  input.onchange = function(e) {
    currentFormSet.set(input.id, input.value);
    saveForm();
  };
  input.value =
    typeof currentFormSet.get(input.id) != "undefined" ?
    currentFormSet.get(input.id) :
    "";
});

function saveForm() {
  localStorage.setItem("form_set", JSON.stringify(currentFormSet));
}

function showForm(form) {
  document.querySelectorAll("#" + formsID.join(", #")).forEach(function(elem) {
    if (form.id == elem.id) {
      elem.style.display = "block";
    } else {
      elem.style.display = "none";
    }
  });
  if (form.id === formsID[1]) {
    changeTitle("Step Into the Ring with Bushido Boxers Club.");
    changeLog("");

    var genInp = document.getElementById('gender');

    function selectGender() {
      modal.optionsPicker(
          [{
            inputId: 'male',
            attr: {
              checked: true
            },
            value: 'male',
            title: 'Male',
            subTitle: 'He/His'
          }, {
            inputId: 'female',
            attr: {},
            value: 'female',
            title: 'Female',
            subTitle: 'She/Her'
          }], true,
          userboxUI.pickerBox(
            '#(inputId)',
            '#(title)', '#(subTitle)',
            true), 'Select your gender')
        .then(function(val) {
          genInp.value = val;
          currentFormSet.set('gender', val);
          saveForm()
        })
    }
    genInp.onfocus = selectGender;
    genInp.onclick = selectGender;

    var dobInp = document.getElementById('dob');
    dobInp.type = ''
    dobInp.readonly = true;

    function saveCalenderData(date) {
      dob.value = date;
      currentFormSet.set(dobInp.id, dobInp.value);
      saveForm()
    }

    const { Calendar } = window.VanillaCalendarPro;
    let date = ''
    const calender = new Calendar('#dob', {
      inputMode: true,
      input: true,
      selectedTheme: 'system',
      positionToInput: 'auto',
      displayDateMax: '2020-01-01',
      onClickDate(self, e) {
        date = self.context.selectedDates[0];
        dob.value = date;
      },
      onHide() {
        saveCalenderData(date)
      }
    })
    calender.init();
  } else if (form.id === formsID[2]) {
    changeTitle("Begin Your Training at Bushido Boxers Club");
    changeLog("");
  } else if (form.id === formsID[3]) {
    changeTitle("Your Fitness Adventure Begins Here");
    changeLog("");
  }

  if (form.id !== formsID[3]) {
    document.getElementById("nextBtn").innerHTML = "Continue";
  } else {
    document.getElementById("nextBtn").innerHTML = "Register";
  }

  if (form.id != formsID[0]) {
    document.getElementById("backBtn").style.display = "block";
  } else {
    document.getElementById("backBtn").style.display = "none";
  }
}

function changeLog(log) {
  document.getElementById("logger").innerHTML = log;
  app.lettersToElem(document.getElementById("logger"));
  anime.timeline({ loop: false }).add({
    targets: "#logger .letter",
    duration: 450,
    delay: (el, i) => 40 * i,
    easing: "easeOutExpo",
    opacity: [0, 1],
    scale: [0.4, 1],
    keyframes: [
      {
        filter: "blur(1px)",
      },
      {
        filter: "blur(0px)",
      },
    ],
    complete: function() {
      setTimeout(function() {
        app.preventLetters(document.querySelector("#logger"));
      }, 50);
    },
  });
}

function changeTitle(msg) {
  document.getElementById("title").innerHTML = msg;
  app.lettersToElem(document.getElementById("title"));
  anime.timeline({ loop: false }).add({
    targets: "#title .letter",
    duration: 450,
    delay: (el, i) => 40 * i,
    easing: "easeOutExpo",
    opacity: [0, 1],
    scale: [0.4, 1],
    keyframes: [
      {
        filter: "blur(1px)",
      },
      {
        filter: "blur(0px)",
      },
    ],
    complete: function() {
      setTimeout(function() {
        app.preventLetters(document.querySelector("#title"));
      }, 50);
    },
  });
}


function getPhoneNumberErrorMessage(phoneNumber) {
  const trimmedPhoneNumber = phoneNumber.trim();

  if (!trimmedPhoneNumber.startsWith('+')) {
    return 'Phone number must start with a "+" symbol.';
  }

  const phoneNumberWithoutPlus = trimmedPhoneNumber.substring(1);
  const parts = phoneNumberWithoutPlus.replace(/[\(\)\s]/g, '').match(/.{1,3}/g);

  if (!parts) {
    return 'Invalid phone number format. Please use a valid international phone number format.';
  }

  if (parts.length < 3 || parts.length > 4) {
    return 'Invalid phone number format. Please use a valid international phone number format.';
  }

  if (parts.some(part => part.length < 1 || part.length > 3 || !/^\d+$/.test(part))) {
    return 'Invalid phone number format. Please use a valid international phone number format.';
  }

  return 'Invalid phone number format. Please use a valid international phone number format.';
}

function changeState(nextState) {
  var currentState = currentFormSet.state;
  switch (currentState) {
    case formsID[0]:
      var fullname = document.getElementById("fullname"),
        email = document.getElementById("email"),
        phone = document.getElementById("phone");

      const phoneRegExp = /^\+(?:[0-9]{1,3})?\s?(?:\([0-9]{3}\)|[0-9]{3})\s?[0-9]{3}\s?[0-9]{4}$/;

      if (!fullname.value) {
        changeLog("Name input is blank, please fill the form correctly");
      } else if (!email.value) {
        changeLog("Email input is blank, please fill the form correctly");
      } else if (
        !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
        email.value.includes(" ") ||
        email.value[email.value.length - 1] == " "
      ) {
        changeLog(
          "Invalid email, email format incorrect or contains space. ( eg:- example@gmail.com )"
        );
      } else if (!phone.value || !phoneRegExp.test(phone.value)) {
        changeLog(
          getPhoneNumberErrorMessage(phone.value)
        );
      } else {
        phone.value = phone.value.replace('+', '').replaceAll(" ", "");
        email.value = email.value.replaceAll(" ", "");
        changeLog("Checking availability, please wait...");
        if (typeof spinner != "undefined") {
          spinner.showPreloader("Checking availability....");
        }
        bushido
          .useQuery("accounts", [["email", "==", email.value]])
          .then(function(snapshot) {
            var data = [];
            snapshot.forEach(function(item) {
              data.push(item);
            });
            if (data.length == 0) {
              modal.confirm(
                "WhatsApp Notification Consent and Verification",
              ["By clicking, you agree to receive WhatsApp notifications from us. You can unsubscribe at any time by replying \"STOP\". We won't share your number with third parties. You hold us harmless for any claims related to these notifications.",
               "Confirm your WhatsApp phone number:",
               '<strong>+' + phone.value + '</strong>',
               "We will send a verification code to this number to complete the registration process."].join("<br/><br/>")
                ).then((isPhoneRight) => {
                if (isPhoneRight) {
                  spinner.changeText('Sending code...')
                  let randomCode = Math.floor(Math.random() * 999999)
                  app.sendWhatsappMsg(phone.value, "*Bushido* Verification Code: *" + randomCode +
                    "*. Enter this code to complete your registration. If you didn't request this code, please ignore this message."
                    ).then(function() {
                    modal.prompt('Verfication Code', '', 'CODE HERE').then((userEnteredCode) => {
                      if (userEnteredCode == randomCode) {
                        spinner.removePreloader().then(function() {
                          closeForm(function() {
                            currentFormSet.state = nextState;
                            saveForm();
                            showForm(document.getElementById(nextState));
                          })
                        })
                      } else {
                        modal.alert('Code Mismatch!', 'Your entered code is wrong!')
                        spinner.removePreloader()
                      }
                    });
                  })
                } else {
                  window.location.reload();
                }
              })
            } else {
              spinner.removePreloader().then(function() {
                changeLog("Not available this email or phone!");
              });
            }
          });
      }
      break;
    case formsID[1]:
      var password = document.getElementById("password"),
        dob = document.getElementById("dob"),
        gender = document.getElementById('gender');


      if (!password.value) {
        changeLog("Password input is blank, please fill the form correctly");
      } else if (password.value.length <= 7) {
        changeLog("Password require minimum 8 letters");
      } else if (!gender.value) {
        changeLog(
          "Gender input is blank, please fill the form correctly"
        );
      } else if (!dob.value) {
        changeLog(
          "Date of birth input is blank, please fill the form correctly"
        );
      } else {
        closeForm(function() {
          currentFormSet.state = nextState;
          saveForm();
          showForm(document.getElementById(nextState));
        });
      }
      break;
    case formsID[2]:
      var address = document.getElementById("address"),
        height = document.getElementById("height"),
        weight = document.getElementById("weight");

      if (!address.value) {
        changeLog("Address input is blank, please fill the form correctly...");
      } else if (address.value.length <= 10) {
        changeLog("Address require minimum 10 letters");
      } else if (!height.value) {
        changeLog(
          "Height input is blank. please tell about your height in centimetres"
        );
      } else if (height.value < 15 || height.value > 400) {
        changeLog("Wrong height, please tell your height in centimetres ");
      } else if (!weight.value) {
        changeLog(
          "Weight input is blank. please tell about your weight in Kilogram"
        );
      } else {
        closeForm(function() {
          currentFormSet.state = nextState;
          saveForm();
          showForm(document.getElementById(nextState));
        });
      }
      break;
    case formsID[3]:
      var goal = document.getElementById("goal");

      if (!goal.value || goal.value < 8) {
        changeLog("Goal input is blank or require minimum 8 letters");
      } else {
        var PWS = currentFormSet.get("password");
        if (CryptoJS) {
          currentFormSet.set(
            "password",
            CryptoJS.AES.encrypt(
              currentFormSet.data.password,
              config.ENC_KEY
            ).toString()
          );
        }
        saveForm();
        spinner.showPreloader("Completing, Please wait...");
        const userID =
          "user_" +
          Math.floor(Math.random() * 9999999) +
          "_" +
          Math.floor(Math.random() * 99999);
        currentFormSet.set("id", userID);

        bushido
          .set("accounts/" + userID, currentFormSet.data)
          .then(function() {
            spinner.changeText("Server connected successfully...");
            currentFormSet.completed = true;

            createCronJob(config.jobKey, 'https://wbot-bodg.onrender.com/send/' + currentFormSet.phone,
              MONTH_SCHEDULE, {
                body: JSON.stringify({
                  msg: "Hey! Just a reminder that your monthly *Bushido Boxers Club* fee of *₹1000* is due. Thanks!"
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              }, 'POST').then(() => {
              saveForm();
              setTimeout(function() {
                spinner.changeText("Signing your account");
                window.location.href =
                  "../login/?email=" +
                  currentFormSet.get("email") +
                  "&pw=" +
                  currentFormSet.get("password") +
                  "&enc=true";
              }, 500);
            })

          });
      }
      break;
  }

  saveForm();
}

document.getElementById("nextBtn").onclick = function() {
  changeState(formsID[currentFormSet.index() + 1]);
};

document.getElementById("backBtn").onclick = function() {
  currentFormSet.state = formsID[0];
  saveForm();
  if (spinner) {
    spinner.showPreloader();
  }

  setTimeout(function() {
    window.location.reload();
  }, 200);
};

document.getElementById("login").onclick = function() {
  menu.close(document.querySelector("#register")).then(function() {
    spinner.showPreloader();
    setTimeout(function() {
      window.location.href = "../login";
    }, 200);
  });
};

function closeForm(onfinish) {
  let query = [
    "#" + document.getElementById(currentFormSet.state).id + " input",
    "#" + document.getElementById(currentFormSet.state).id + " textarea",
    "#" +
      document.getElementById(currentFormSet.state).id +
      " .input-box label",
    "#" + document.getElementById(currentFormSet.state).id + " .eva",
    "#" + document.getElementById(currentFormSet.state).id + " .input-icon",
  ];

  document.querySelectorAll(query.join(", ")).forEach(function(elem) {
    elem.style.animationDirection = "reverse";
    var snapshotStyle = window
      .getComputedStyle(elem)
      .getPropertyValue("animation");

    elem.style.animation = "none";
    setTimeout(function() {
      elem.style.animation = snapshotStyle;
      //elem.style.animationDelay = '0s';
      elem.onanimationend = function() {
        elem.style.display = "none";
        elem.style.animationDirection = "forward";
        if (typeof onfinish == "function") {
          onfinish();
        }
      };
    }, 100);
  });
}