const handleLogin = (err) => {
  window.location.href = "../register";
};
//if (caches) {
// caches.open('admin').then(function(cache) {
//   if (localStorage.getItem('adminUrl')) {
//     cache.match(localStorage.getItem('adminUrl')).then(function(res) {
//       if (res) {
//         res.json().then(function(data) {
//           if (localStorage.getItem('adminKey') === data.key) {
//             // continues
//           } else {
//             handleLogin('key not match')
//           }
//         })
//       } else { handleLogin(res) }
//     }).catch(handleLogin)
//   } else {
//     handleLogin('not found url')
//   }
// }).catch(handleLogin)

var db = "admin",
  saveKey = "adminUrl",
  key = "admin-access-key";

new Promise((resolve, reject) => {
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
      // var decrypted = CryptoJS.AES.decrypt(data, saveKey).toString(
      //   CryptoJS.enc.Utf8
      // );
      resolve(JSON.parse(data));
    } else {
      reject("404: no data found");
    }
  }
})
  .then(function (data) {
    if (localStorage.getItem("adminKey") === data.key) {
      // continues
    } else {
      handleLogin("key not match");
    }
  })
  .catch(function (e) {
    handleLogin("not found url");
  });
