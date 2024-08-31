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
  cssAnimListQuery.forEach(function (query, i) {
    var delayScalePos = delayScaleChild[i];
    var baseDelayPos = baseDelayChild[i];

    if (delayScalePos === 0) {
      var elem = document.querySelector(query);
      elem.style.animationDelay = baseDelayPos + "ms";
      elem.style.animationPlayState = "running";
    } else {
      var elems = document
        .querySelectorAll(query)
        .forEach(function (elem, eIndex) {
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

  var objectParams = app.getQueryParams();
  if (objectParams.email == undefined || objectParams.pw == undefined) {
  } else {
    spinner.showPreloader("Auto signing...");
    alert(objectParams.email + "-  :  -" + objectParams.pw);
    signIn(objectParams.email, objectParams.pw, true);
  }

  //menu.close(document.querySelector('.menubox .menu-item'), 'preview')
}

app
  .validUser()
  .then(() => {
    window.location.href = "../events";
  })
  .catch((err) => err);

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
    complete: function () {
      setTimeout(function () {
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
    complete: function () {
      setTimeout(function () {
        app.preventLetters(document.querySelector("#title"));
      }, 50);
    },
  });
}

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

  document.querySelectorAll(query.join(", ")).forEach(function (elem) {
    elem.style.animationDirection = "reverse";
    var snapshotStyle = window
      .getComputedStyle(elem)
      .getPropertyValue("animation");

    elem.style.animation = "none";
    setTimeout(function () {
      elem.style.animation = snapshotStyle;
      elem.style.animationDelay = "0s";
      elem.onanimationend = function () {
        elem.style.display = "none";
        elem.style.animationDirection = "forward";
        if (typeof onfinish == "function") {
          onfinish();
        }
      };
    }, 100);
  });
}

document.getElementById("register").onclick = function () {
  menu.close(document.querySelector("#login")).then(function () {
    spinner.showPreloader();
    setTimeout(function () {
      window.location.href = "../register";
    }, 200);
  });
};

document.getElementById("nextBtn").onclick = function () {
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  // var encrypted = CryptoJS.AES.encrypt(password.value, config.ENC_KEY + 'Password').toString();
  spinner.showPreloader("Connecting...");
  signIn(email.value, password.value, false);
};

function signIn(email, pw, enc = false) {
  return new Promise((resolve, reject) => {
    bushido
      .useQuery("accounts", [["email", "==", email]])
      .then(function (snapshot) {
        var arr = bushido.toData(snapshot);
        if (arr.length == 0) {
          var err =
            "Sorry, no account found in this email. credientails are wrong, check the email and password. or check your internet connection";
          modal.alert("Sign Faild!", err, "").then(function () {
            reject(err);
            spinner.removePreloader();
          });
        } else {
          const data = arr[0].data();
          const decryptedPassCode = CryptoJS.AES.decrypt(
            data.password,
            config.ENC_KEY
          );
          const decryptedPass = decryptedPassCode.toString(CryptoJS.enc.Utf8);
          const decryptedPWCode = CryptoJS.AES.decrypt(pw, config.ENC_KEY);
          alert("decrypted server pw " + decryptedPass);
          setTimeout(function () {
            const decryptedPW = decryptedPWCode.toString(CryptoJS.enc.Utf8);
            console.log("completed pw", decryptedPW);

            alert(decryptedPW);

            if (
              pw == decryptedPass ||
              decryptedPW == decryptedPass ||
              pw == data.password ||
              decryptedPW == data.password
            ) {

              app.saveData('user', 'about-user', data, 'userUrl').then(()=>{
                spinner.removePreloader();
                window.location.href = "../events";
              })
              // caches.open("user").then(function (cache) {
              //   cache
              //     .put(
              //       "about-user",
              //       new Response(JSON.stringify(data), {
              //         headers: { "Content-type": "application/json" },
              //       })
              //     )
              //     .catch((err) => {
              //       alert(err);
              //       reject(err);
              //     })
              //     .then(() => {
              //       resolve();
              //       cache.keys("about-user").then(function (t) {
              //         localStorage.setItem("userUrl", t[0].url);
              //         spinner.removePreloader();
              //         window.location.href = "../events";
              //       });
              //     });
              // });
            } else {
              var err =
                "password doesn't match or autologin didn't get match able password, try manual login";
              reject(err);
              modal.alert("Autologin Faild...", err, "").then(function () {
                spinner.removePreloader();
              });
            }
          }, 1000);
        }
      })
      .catch((err) => {
        alert(err);
        alert("try refresh the app");
        reject(err);
      });
  });
}
