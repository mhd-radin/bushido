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

  document.querySelectorAll("*").forEach(function (elem) {
    elem.onerror = handleError;
  });
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
      if (entry.intersectionRatio > 0.3) {
        // Add your animation logic here
        entry.target.classList.add("animate");
      } else {
        // Remove animation if needed when the element goes out of view
        entry.target.classList.remove("animate");
        entry.target.classList.remove("animate-lite")
      }
    });
  },
  { threshold: 0.3}
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
        entry.target.classList.remove("animate-lite")
      }
    });
  },
  { threshold: 0.3 }
);


const app = {
  lettersToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(
      /\S/g,
      '<span class="letter">$&</span>'
    );
    return elem;
  },
  wordsToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(/\b\w+\b/g, function (match) {
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
      setTimeout(function () {
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
  validUser() {
    return new Promise((resolve, reject) => {
      function handleReject(err) {
        localStorage.removeItem("form_set");
        reject(err);
      }

      app
        .getData("user", "about-user", "userUrl")
        .then(function (data) {
          if (typeof bushido != "undefined" && !navigator.onLine ) {
            alert()
            bushido
              .get("accounts", data.id)
              .then(function (user) {
                if (user.exists()) {
                  resolve(data || user);
                } 
              })
              .catch(function (err){
                console.log(err);
                
              });
          } else {
            resolve(data);
          }
        })
        .catch(handleReject);
    });
  },
  saveData(db, key, data, saveKey, enc = true) {
    return new Promise((resolve, reject) => {
      if ("caches" in window) {
        caches.open(db).then(function (cache) {
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
              cache.keys(key).then(function (t) {
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
                .then(function (res) {
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
  themes: [
    "darkmoon-theme",
    "blueocean-theme",
    "redhouse-theme",
    "classic-theme",
  ],
  setTheme(theme) {
    this.resetTheme();
    document.body.classList.add(theme);
    this.currentTheme = theme;
  },
  resetTheme() {
    document.body.classList.forEach((item) => {
      document.body.classList.remove(item);
    });
  },
  useStoredTheme() {
    if (localStorage.getItem("app-theme")) {
      this.resetTheme();
      this.setTheme(localStorage.getItem("app-theme"));
    }
  },
  storeCurrentTheme() {
    localStorage.setItem("app-theme", this.currentTheme);
  },
};

if (typeof eva != "undefined") {
  eva.replace();
}

themeManager.useStoredTheme();

function handleError(err) {
  alert(err);
}

window.onerror = handleError;

/* cache 
if ("caches" in window){
  navigator.serviceWorker.register('../public/csw.js', 
  ).then(function(registration){
    
  })
}
*/
