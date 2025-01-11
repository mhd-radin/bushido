const inputData = [{
  type: 'select',
  default: null,
  min: 10,
  clkId: 'theme',
  saveNeeded: false,
  preloaderNeeeded: false,
  valueMatchRule: null,
  isTextarea: false,
  data: [{
      title: 'Light Theme',
      value: 'light',
      attr: {
        checked: true
      }
  },
    {
      title: 'Dark Theme',
      value: 'dark',
      attr: {}
  }, {
      title: 'Darkmoon',
      value: 'darkmoon',
      attr: {}
  }, {
      title: 'Redhouse',
      value: 'redhouse',
      attr: {}
  }, {
      title: 'Blue Ocean',
      value: 'blueocean',
      attr: {}
  }, {
      title: 'DarkBlue Theme',
      value: 'darkblue',
      attr: {}
  }, {
      title: 'Greenleaf Theme',
      value: 'greenleaf',
      attr: {}
  }, {
      title: 'Classic',
      value: 'classic',
      attr: {}
  }]
}, {
  type: 'select',
  clkId: 'icon',
  data: [{
      title: 'Lucide Icons',
      value: 'lucide',
      attr: {}
  },
    {
      title: 'Eva Icons',
      value: 'eva',
      attr: {}
  }]
}]

function InpDataToOptData(inpData) {
  var arr = [];
  inpData.data.map((item, i) => {
    arr.push({
      inputId: inputData.type +
        '_' + Math.floor(Math
          .random() * 9999),
      attr: item.attr,
      value: item.value,
      title: item.title
    })
  })

  return arr;
}

const PropertiesDictionary = {
  'username': 'fullname',
  use(propName) {
    if (this[propName]) {
      return this[propName]
    } else return propName;
  }
}


if (document.getElementById('theme')) {
  document.getElementById('theme')
    .querySelector('.opt-subtext')
    .innerHTML = 'current theme is ' +
    themeManager.currentTheme.replace(
      '-theme', '');
}




function useInputSelectors(inpData =
  inputData) {
  function updateUserProperty(
    propertyKey, value) {
    return new Promise(function(resolve,
      reject) {
      app.validUser().then(function(
        data) {
        if (app.clientID) {
          if (data[
              propertyKey] !==
            value) {
            data[propertyKey] =
              value;

            bushido.set(
              'accounts/' +
              app.clientID, {
            [propertyKey]: value
              }, {
                merge: true
              }).then(
              function() {
                app.saveData(
                    'user',
                    'about-user',
                    data,
                    'userUrl')
                  .then(
                    () => {
                      resolve
                        ()
                    })
              }).catch(reject)
          } else {
            resolve()
          }
        } else {
          app.validUser().then((
            data) => {
            updateUserProperty
              (propertyKey,
                value).then(
                resolve)
              .catch(reject)
          })
        }
      }).catch(reject)
    })
  }

  function handleOutput(val, item) {

    switch (item.clkId) {
      case 'theme':
      case 'icon':
        if (val) {
          if (item.clkId == 'theme') {
            themeManager.setTheme(val +
              '-theme')
            themeManager
              .storeCurrentTheme()
            document.getElementById(
                'theme').querySelector(
                '.opt-subtext')
              .innerHTML =
              'current theme is ' + val;
          }
          else if (item.clkId == 'icon') {
            if (val == 'lucide') {
              localStorage.setItem('useLucide', true);
            } else {
              localStorage.removeItem('useLucide');
            }

            modal.alert('Refresh required', (id, bid) => {
              // document.getElementById('bid').innerHTML = 'Refresh';
              return 'Refresh to apply icon set. click the button to refresh page'
            }).then(function() {
              location.reload(true)
            })
          }
        }
        break;
      case 'password':
        app.validUser().then(function(
          data) {
          modal.prompt(
            'New Password', val,
            'Password', false,
            'text').then(function(
            enteredPassword) {
            if (
              enteredPassword) {
              var encrypted =
                CryptoJS.AES
                .encrypt(
                  enteredPassword,
                  config.ENC_KEY
                ).toString()
              updateUserProperty
                (PropertiesDictionary
                  .use(item
                    .clkId),
                  encrypted)
                .then(
                  function() {})
                .catch((
                  err) => {
                  modal.alert(
                    'ERROR CHANGING PASSWORD: ' +
                    err)
                })
            }
          })
        })
        break;
      default:
        if (val) {
          updateUserProperty(
            PropertiesDictionary.use(
              item.clkId), val).then(
            function() {
              document.getElementById(
                  item.clkId)
                .querySelector(
                  '.opt-subtext')
                .innerHTML = val;
            }).catch((err) => {
            modal.alert('ERROR: ' +
              err)
          })
        }
        break;
    }
  }

  inpData.forEach((item, ind) => {
    var itemElem = document
      .getElementById(item.clkId);
    if (item.default) {
      var label = item.default;
      if (item.clkId ===
        'password') {
        label =
          '&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;'
      } else if (item.clkId ===
        'theme') {
        var currentTheme =
          themeManager.currentTheme;
        item.data.forEach(function(
          themeData, i) {
          inpData[ind].data[i]
            .attr.checked =
            false;
          if (themeData
            .value ===
            currentTheme) {
            themeData.attr
              .checked = true;
          }
        })
      }
      itemElem.querySelector(
          '.opt-subtext')
        .innerHTML = label;
    }

    if (itemElem) {
      itemElem.onclick =
        function() {
          var title = itemElem
            .querySelector(
              '.opt-title')
            .innerText;
          if (item.type ===
            'select') {
            modal.optionsPicker(
                InpDataToOptData(
                  item), true,
                userboxUI.pickerBox(
                  '#(inputId)',
                  '#(title)', '',
                  true), title)
              .then(function(val) {
                handleOutput(val,
                  item)
              })
          } else {
            if (item.type ===
              'password') {
              app.validUser().then(
                function(data) {
                  modal.prompt(
                      'Enter Your Current Password',
                      '',
                      'Current Password',
                      false,
                      'password')
                    .then(
                      function(
                        enteredPassword
                      ) {
                        if (
                          enteredPassword ===
                          CryptoJS
                          .AES
                          .decrypt(
                            data
                            .password,
                            config
                            .ENC_KEY
                          )
                          .toString(
                            CryptoJS
                            .enc
                            .Utf8)
                        ) {
                          handleOutput
                            (enteredPassword,
                              item
                            )
                        } else {
                          modal
                            .alert(
                              "Password Mismatch",
                              'Please re-enter your current password to ensure it matches the one we have on record. Make sure to enter it correctly this time. Check for typos and try again!'
                            )
                        }
                      })
                })
            } else {
              modal.prompt(title,
                item.default,
                title, false, item
                .type).then(
                function(val) {
                  handleOutput(
                    val, item)
                })
            }
          }
        }
    }
  })
}

app.validUser().then((user) => {

  if (document.getElementById(
      'email')) {
    document.getElementById('email')
      .querySelector('.opt-subtext')
      .innerHTML = user.email;
  }
  if (document.getElementById(
      'titleName')) {
    document.getElementById(
        'titleName').innerHTML =
      user.fullname;
  }
  if (document.getElementById(
      'titleEmail')) {
    document.getElementById(
        'titleEmail').innerHTML =
      user.email;
  }
  if (document.getElementById(
      'avatar')) {
    document.getElementById(
        'avatar').src = app
      .avatarUrl(user.fullname);
  }


  inputData.push({
    type: 'text',
    default: user.fullname,
    min: 0,
    clkId: 'username',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: false
  }, {
    type: 'tel',
    default: user.phone,
    min: 8,
    clkId: 'phone',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: false
  }, {
    type: 'password',
    default: '', //CryptoJS.AES.decrypt(user.password, config.ENC_KEY).toString(CryptoJS.enc.Utf8),
    min: 8,
    clkId: 'password',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: false
  }, {
    type: 'date',
    default: user.dob,
    min: 0,
    clkId: 'dob',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: false
  }, {
    type: 'text',
    default: user.address,
    min: 10,
    clkId: 'address',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: true
  }, {
    type: 'text',
    default: user.goal,
    min: 5,
    clkId: 'goal',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: true
  }, {
    type: 'number',
    default: user.height,
    min: 30,
    clkId: 'height',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: false
  }, {
    type: 'number',
    default: user.weight,
    min: 20,
    clkId: 'weight',
    data: [],
    saveNeeded: true,
    preloaderNeeeded: true,
    valueMatchRule: null,
    isTextarea: false
  });

  useInputSelectors();


  document.getElementById('deleteAcc').onclick = function() {
    modal.confirm('Delete account permanently', `delete your account (${user.email}) permanently in server that can't be restored. are you sure to delete your account`).then(function(val) {
      if (val) {
        var num = Math.floor(Math.random() * 9999);
        modal.prompt('Delete Account <br><small>to delete your account write </small>"' + num + '" to confirm', '', 'code').then(function(pass) {
          if (num == pass) {
            spinner.showPreloader('Deleting...')
            bushido.set('accounts/' + user.id, {}).then(function() {
              localStorage.clear();
              location.reload();
            })
          } else {
            modal.alert('Delete Cancelled!', '')
          }
        })
      }
    })
  }
}).catch(() => {
  app.redirectWithPreloader(
    '../register')
})

document.getElementById('about').onclick = function() {
  modal.alert('About Bushido', 
    `
    <div class="logo-cont"><img src="../assets/logos/bbc_w.png" class='about-logo'/></div>
    
    Bushido is an outstanding martial arts and boxing club located in Malappuram, Kerala, focused on helping people grow through combat sports. The club is run by a coach who has won national championships and provides top-notch training in Muay Thai, Boxing, Karate, and more.
<br/><br/>
The Bushido software, developed by <strong><a href="tel:8078496988">Muhammed Radin</a></strong>, enriches the experience with daily story videos, photos, updates about events, opportunities for community engagement, and a direct chat option with the coach. Aimed at martial arts fans, Bushido blends traditional training principles with modern technology, creating a lively and connected community.`)
}


document.getElementById('logout').onclick = function() {
  modal.confirm('Logout Account', 'logout current account. are youe sure Logout?').then(function(val) {
    if (val) {
      localStorage.clear();
      location.reload();
    }
  })
}