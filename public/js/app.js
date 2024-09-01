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

  document.querySelectorAll("*").forEach(function(elem) {
    elem.onerror = handleError;
  });
  document.documentElement.style.setProperty("--animation-state", "running");

  // document.querySelector('input[type="date"]').onclick = function(param) {
  //   var elem = document.querySelector('input[type="date"]');
  //   if (elem.roll != 'static') elem.type = 'text';
  //   modal.optionsPicker([{
  //     value: 'sys',
  //     inputId: 'sys',
  //     attr: {},
  //     name: 'System Date Selector',
  //     des: 'default date selector of your device'
  //     }, {
  //     value: 'cus',
  //     inputId: 'cus',
  //     attr: {},
  //     name: 'Bushido Date Selector',
  //     des: 'for easly select the date'
  //     }], true, userboxUI.create('#(name)', '#(des)', '', userboxUI.input('#(inputId)', true)), 'Choose a method for selecting date').then(function(val) {
  //     elem.type = 'date'
  //     elem.roll = 'static'
  //     if (val == 'sys') {
  //       elem.click()
  //     } else {

  //     }
  //   })
  // }
}

document.body.onload = pageonload;
//window.onload = pageonload;

const app = {
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
  validUser() {
    return app.getData('user', 'about-user', 'userUrl');

  },
  saveData(db, key, data, saveKey, enc = true) {
    return new Promise((resolve, reject) => {
      if ("caches" in window) {
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
        localStorage.setItem(
          db + "_" + key,
          data
        );
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

if (typeof eva != "undefined") {
  eva.replace();
}

function handleError(err) {
  alert(err);
}

window.onerror = handleError;