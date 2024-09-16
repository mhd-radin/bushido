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
    title: 'Darkmoon',
    value: 'darkmoon',
    attr: {
      checked: true
    }
  }, {
    title: 'Red House',
    value: 'redhouse',
    attr: {}
  }, {
    title: 'Blue Ocean',
    value: 'blueocean',
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

function useInputSelectors(inpData = inputData) {
  function handleOutput(val, item) {
    
    switch (item.clkId) {
      case 'theme':
        if (val) {
          themeManager.setTheme(val + '-theme')
          themeManager.storeCurrentTheme()
        }
        break;
    }
  }

  inpData.forEach((item) => {
    var itemElem = document.getElementById(item.clkId);
    if (itemElem) {
      itemElem.onclick = function() {
        var title = itemElem.querySelector('.opt-title').innerText;
        if (item.type === 'select') {
          modal.optionsPicker(InpDataToOptData(item), true, userboxUI.pickerBox('#(inputId)', '#(title)', '', true), title).then(function(val) {
            handleOutput(val, item)
          })
        } else {
          modal.prompt(title, item.default, title, false, item.type).then(function(val) {
            handleOutput(val, item)
          })
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
    type: 'text',
    default: CryptoJS.AES.decrypt(user.password, config.ENC_KEY).toString(CryptoJS.enc.Utf8),
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