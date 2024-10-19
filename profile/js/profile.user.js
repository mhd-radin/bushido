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
  },{
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
  },{
    title: 'Greenleaf Theme',
    value: 'greenleaf',
    attr: {}
  }, {
    title: 'Classic',
    value: 'classic',
    attr: {}
  }]
}]

function InpDataToOptData(inpData) {
  var arr = [];
  inpData.data.map((item, i) => {
    arr.push({
      inputId: inputData.type + '_' + Math.floor(Math.random() * 9999),
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



function useInputSelectors(inpData = inputData) {
  function updateUserProperty(propertyKey, value) {
    return new Promise(function(resolve, reject) {
      app.validUser().then(function(data) {
        if (app.clientID) {
          if (data[propertyKey] !== value) {
            data[propertyKey] = value;

            bushido.set('accounts/' + app.clientID, {
            [propertyKey]: value
            }, {
              merge: true
            }).then(function() {
              app.saveData('user', 'about-user', data, 'userUrl').then(() => {
                resolve()
              })
            }).catch(reject)
          } else {
            resolve()
          }
        } else {
          app.validUser().then((data) => {
            updateUserProperty(propertyKey, value).then(resolve).catch(reject)
          })
        }
      }).catch(reject)
    })
  }

  function handleOutput(val, item) {

    switch (item.clkId) {
      case 'theme':
        if (val) {
          themeManager.setTheme(val + '-theme')
          themeManager.storeCurrentTheme()
        }
        break;
      case 'password':
        app.validUser().then(function(data) {
          modal.prompt('New Password', val, 'Password', false, 'text').then(function(enteredPassword) {
              if (enteredPassword) {
                var encrypted = CryptoJS.AES.encrypt(enteredPassword, config.ENC_KEY).toString()
                updateUserProperty(PropertiesDictionary.use(item.clkId), encrypted).then(function() {
                }).catch((err) => {
                  modal.alert('ERROR CHANGING PASSWORD: ' + err)
                })
              }
          })
        })
        break;
      default:
        if (val) {
          updateUserProperty(PropertiesDictionary.use(item.clkId), val).then(function() {
            document.getElementById(item.clkId).querySelector('.opt-subtext').innerHTML = val;
          }).catch((err) => {
            modal.alert('ERROR: ' + err)
          })
        }
        break;
    }
  }

  inpData.forEach((item) => {
    var itemElem = document.getElementById(item.clkId);
    if (item.default) {
      var label = item.default;
      if (item.clkId === 'password') {
        label = '&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;'
      }
      itemElem.querySelector('.opt-subtext').innerHTML = label;
    }
    if (itemElem) {
      itemElem.onclick = function() {
        var title = itemElem.querySelector('.opt-title').innerText;
        if (item.type === 'select') {
          modal.optionsPicker(InpDataToOptData(item), true, userboxUI.pickerBox('#(inputId)', '#(title)', '', true), title).then(function(val) {
            handleOutput(val, item)
          })
        } else {
          if (item.type === 'password') {
            app.validUser().then(function(data) {
              modal.prompt('Enter Your Current Password', '', 'Current Password', false, 'password').then(function(enteredPassword) {
                if (enteredPassword === CryptoJS.AES.decrypt(data.password, config.ENC_KEY).toString(CryptoJS.enc.Utf8)) {
                  handleOutput(enteredPassword, item)
                } else {
                  modal.alert("Password Mismatch", 'Please re-enter your current password to ensure it matches the one we have on record. Make sure to enter it correctly this time. Check for typos and try again!')
                }
              })
            })
          } else {
            modal.prompt(title, item.default, title, false, item.type).then(function(val) {
              handleOutput(val, item)
            })
          }
        }
      }
    }
  })
}

app.validUser().then((user) => {

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

  useInputSelectors()
}).catch(() => {
  app.redirectWithPreloader('../register')
})