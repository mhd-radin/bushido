function pageonload() {
  if (typeof spinner != "undefined") {
    spinner.removePreloader().then(() => {
      if (typeof onpageloadin == "function") {
        onpageloadin();
      }
    });
  } else if (typeof onpageloadin == "function") {
    onpageloadin();
  }

  if (typeof eva != "undefined") {
    eva.replace();
  }

  // document.querySelectorAll("*").forEach(function(elem) {
  //   elem.onerror = handleError;
  // });
  document.documentElement.style.setProperty("--animation-state", "running");
}

document.body.onload = pageonload;
//window.onload = pageonload;

window.addEventListener(
  "scroll",
  () => {
    document.documentElement.style.setProperty(
      "--root-scroll",
      window.scrollY / (document.body.offsetHeight - window.innerHeight)
    );
  },
  false
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add your animation logic here
        entry.target.classList.add("animate-lite");
      }
      if (entry.intersectionRatio < 1) {
        // Add your animation logic here
        entry.target.classList.add("animate");
      } else {
        // Remove animation if needed when the element goes out of view
        entry.target.classList.remove("animate");
        entry.target.classList.remove("animate-lite");
      }
    });
  }, { threshold: 0.1 }
);

const microObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add your animation logic here
        entry.target.classList.add("animate-lite");
      }
      if (entry.intersectionRatio > 0.3) {
        // Add your animation logic here
        entry.target.classList.add("animate");
      } else {
        // Remove animation if needed when the element goes out of view
        entry.target.classList.remove("animate");
        entry.target.classList.remove("animate-lite");
      }
    });
  }, { threshold: 0.3 }
);

const app = {
  first_time_log: localStorage.getItem("first_time"),
  version: 1.0,
  lettersToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(
      /\S/g,
      '<span class="letter">$&</span>'
    );
    return elem;
  },
  wordsToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(/\b\w+\b/g, function(match) {
      return `<span class="word">${match}</span>`;
    });
    return elem;
  },
  preventLetters(elem) {
    elem.innerHTML = elem.innerText;
  },
  getDayDate() {
    var dt = new Date();
    return (
      dt.getDay().toLocaleString("in", { minimumIntegerDigits: 2 }) +
      "-" +
      dt.getMonth().toLocaleString("in", { minimumIntegerDigits: 2 }) +
      "-" +
      dt.getFullYear()
    );
  },
  parseDate(dateStr) {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  },
  getCSSProp(prop, root = document.documentElement, psdo) {
    var style = getComputedStyle(root, psdo);
    return style.getPropertyValue(prop).trim();
  },
  isDate1Later(dateStr1, dateStr2) {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    const date1 = parseDate(dateStr1);
    const date2 = parseDate(dateStr2);

    return date1 > date2;
  },
  redirectWithPreloader(path) {
    if (spinner) {
      spinner.showPreloader();
      setTimeout(function() {
        window.location.href = path;
      }, 800);
    } else {
      window.location.href = path;
    }
  },
  getQueryParams(url = window.location.href) {
    let params = new URL(url).searchParams;
    let queryParams = {};

    for (let [key, value] of params.entries()) {
      queryParams[key] = value.replace(/ /g, "+"); // Replace spaces back with '+'
    }

    return queryParams;
  },

  avatarUrl(seed, type = "initials", urlOpt = "") {
    return `https://api.dicebear.com/9.x/${type}/svg?seed=${seed}${urlOpt}`;
  },
  // Set a cookie
  setCookie(name, value, minutes) {
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000); // Expiry in minutes
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  },
  getCookie(name) {
    let cname = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(cname) === 0) {
        return cookie.substring(cname.length, cookie.length);
      }
    }
    return "";
  },
  clientID: null,
  validUser() {
    // TODO: make it cookies
    return new Promise((resolve, reject) => {
      function handleReject(err) {
        reject(err);
      }

      app
        .getData("user", "about-user", "userUrl")
        .then(function(data) {
          app.clientID = data.id;
          if (app.getCookie("user") === "" || app.getCookie("user") === null) {
            if (typeof bushido != "undefined" && navigator.onLine) {
              bushido
                .get("accounts", "" + data.id)
                .then(function(user) {
                  if (user.exists()) {
                    var userData = user.data();
                    app
                      .saveData("user", "about-user", userData, "userUrl")
                      .then(() => {
                        app.setCookie("user", "true", 1);
                        resolve(userData);
                      });
                  } else {
                    modal
                      .alert(
                        "Account Not Available",
                        "We couldn't find the account you are looking for. It may have been removed or banned. Click here to go back to the login page."
                      )
                      .then(function() {
                        handleReject();
                      });
                  }
                })
                .catch(function(err) {
                  alert(err)
                });
            } else {
              resolve(data);
            }
          } else {
            resolve(data);
          }
        })
        .catch(handleReject);
    });
  },
  saveData(db, key, data, saveKey, enc = true) {
    return new Promise((resolve, reject) => {
      if ("caches" in window ) {
        caches.open(db).then(function(cache) {
          cache
            .put(
              key,
              new Response(JSON.stringify(data), {
                headers: { "Content-type": "application/json" },
              })
            )
            .catch((err) => {
              reject(err);
            })
            .then(() => {
              cache.keys(key).then(function(t) {
                localStorage.setItem(saveKey, t[0].url);
                resolve();
              });
            });
        });
      } else {
        if (enc) {
          data = CryptoJS.AES.encrypt(JSON.stringify(data), saveKey).toString();
        }
        localStorage.setItem(db + "_" + key, data);
        resolve();
      }
    });
  },
  getData(db, key, saveKey) {
    return new Promise((resolve, reject) => {
      if ("caches" in window) {
        if (localStorage.getItem(saveKey)) {
          caches
            .open(db)
            .then((cache) => {
              cache
                .match(localStorage.getItem(saveKey))
                .then(function(res) {
                  if (res) {
                    res
                      .json()
                      .then((obj) => {
                        if (obj) {
                          resolve(obj);
                        } else {
                          reject("404: user not found");
                        }
                      })
                      .catch((err) => reject(err));
                  } else {
                    reject("404: user not found");
                  }
                })
                .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
        } else {
          reject("404: no data found");
        }
      } else {
        if (localStorage.getItem(db + "_" + key)) {
          var data = localStorage.getItem(db + "_" + key);
          var decrypted = CryptoJS.AES.decrypt(data, saveKey).toString(
            CryptoJS.enc.Utf8
          );
          resolve(JSON.parse(decrypted));
        } else {
          reject("404: no data found");
        }
      }
    });
  },
};


const themeManager = {
  currentTheme: "blueocean-theme",
  themes: {
    "darkmoon-theme": "dark",
    "blueocean-theme": "dark",
    "redhouse-theme": "dark",
    "classic-theme": "light",
    "dark-theme": "dark",
    "darkblue-theme": "dark",
    "greenleaf-theme": "dark",
    "light-theme": "light",
  },
  replaceLogoByTheme() {
    qa('.logo-theme-replace').forEach((e) => {
      switch (themeManager.getThemeRule(themeManager.currentTheme)) {
        case 'dark':
          e.src = e.src.replace('BD', 'WG');
          break;

        case 'light':
          e.src = e.src.replace('WG', 'BD');
          break;
      }
    })
  },
  getThemeRule(theme) {
    return themeManager.themes[theme];
  },
  setTheme(theme) {
    this.resetTheme();
    document.body.classList.add(theme);
    this.currentTheme = theme;
    this.replaceLogoByTheme();
  },
  resetTheme() {
    Object.keys(this.themes).forEach((item) => {
      document.body.classList.remove(item);
    });
  },
  useStoredTheme(id='') {
    if (localStorage.getItem("app-theme"+id)) {
      this.resetTheme();
      this.setTheme(localStorage.getItem("app-theme"+id));
    }
  },
  storeCurrentTheme(id = '') {
    localStorage.setItem("app-theme"+id, this.currentTheme);
  },
};

if (typeof eva != "undefined") {
  eva.replace();
}

themeManager.useStoredTheme();

function handleError(err) {
  alert(err);
  console.log(err)
}

window.onerror = handleError;

const iconManager = {
  lucideDictionary: {
    home: "house",
    person: "user-pen",
    "color-palette": "palette",
    email: "mail",
    "person-delete": "user-round-x",
    pin: "map-pin-house",
    cube: "weight",
    "person-add": "user-round",
    checkmark: "check",
    "paper-plane": "send",
    close: "x",
    "arrow-right": "play",
    use(iconKey) {
      if (this[iconKey]) {
        return this[iconKey];
      } else {
        return iconKey;
      }
    },
  },
  initLucideIcons() {
    return new Promise((resolve, reject) => {
      var script = document.createElement("script");
      script.src = "https://unpkg.com/lucide@latest";
      script.onload = function() {
        resolve();
      };
      document.body.appendChild(script);
    });
  },
  useLucide() {
    this.initLucideIcons().then(function() {
      document.querySelectorAll(".eva").forEach(function(elem) {
        elem.classList.remove("eva");
        var evaCls = "";
        elem.classList.forEach(function(cls) {
          if (cls.includes("eva")) {
            evaCls = cls;
            elem.classList.remove(cls);
          }
        });

        var iconKey = evaCls.replace("eva-", "");
        iconKey = iconKey.replace("-outline", "");
        elem.dataset.lucide = iconManager.lucideDictionary.use(iconKey);
        elem.classList.add("eva");
      });

      lucide.createIcons();
    });
  },
};

if (localStorage.getItem("useLucide")) {

  iconManager.useLucide();
}

/* cache 
if ("caches" in window){
  navigator.serviceWorker.register('../public/csw.js', 
  ).then(function(registration){
    
  })
}
*/

if (!localStorage.getItem("first_time")) {
  localStorage.setItem("first_time", true);
}

function updateApplicationServer(version = app.version) {
  bushido.set("application/latest", {
    version,
    updatedOn: new Date(),
  });
}

function checkApplicationData() {
  bushido.get("application", "latest").then(function(snapshot) {
    var data = snapshot.data();
    if (data.version > app.version) {
      modal.alert(
        "Update Now!",
        "Exciting new features and improvements are just a tap away! Update your app now to access the latest updates and enhance your experience!. V" +
        data.version
      );
    }
  });
}

if (typeof bushido != "undefined") {
  checkApplicationData();
}

var useNetAlert = true;
let isOnline = true;

function netAlertify() {
  if (
    (typeof modal != "undefined" &&
      modal.alert &&
      navigator.onLine === false &&
      useNetAlert === true) ||
    (typeof modal != "undefined" &&
      modal.alert &&
      isOnline === false &&
      useNetAlert === true)
  ) {
    modal.alert(
      "Network Disconnected",
      "No network found. internet connection change detected. check your internet connection"
    );
    useNetAlert = false;
    isOnline = false;
  }

  if (
    (navigator.onLine === true && useNetAlert === false) ||
    (isOnline === true && useNetAlert === false)
  ) {
    useNetAlert = true;
    isOnline = true;
  }
}
setInterval(netAlertify, 2500);

window.addEventListener(
  "online",
  function(e) {
    isOnline = true;
  },
  false
);

window.addEventListener(
  "offline",
  function(e) {
    isOnline = false;
  },
  false
);


function loadModule(src, fn) {
  const script = document.createElement("script");
  script.src = src;
  script.type = "module";
  script.onload = function() {
    fn();
  };
  document.body.appendChild(script)
}


function id(elementId) {
  return document.getElementById(elementId + '');
}

function q(q) {
  return document.querySelector(q + '');
}

function qa(q) {
  return document.querySelectorAll(q + '');
}