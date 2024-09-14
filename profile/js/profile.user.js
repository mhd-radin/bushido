app.validUser().catch(() => {
  app.redirectWithPreloader('../register')
})

const inputData = [{
  type: 'select',
  default: null,
  min: 10,
  clkId: 'theme',
  data: [{
    title: 'Darkmoon',
    value: 'darkmoon',
    attr: {
      checked: true
    }
  }, {
    title: 'Red House',
    value: 'red',
    attr: {}
  }]
}, {
  type: 'text',
  default: '',
  min: 10,
  clkId: 'username',
  data: []
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
  inpData.forEach((item) => {
    var itemElem = document.getElementById(item.clkId);
    if (itemElem) {
      itemElem.onclick = function() {
        var title = itemElem.querySelector('.opt-title').innerText;
        if (item.type === 'select') {
          modal.optionsPicker(InpDataToOptData(item), true, userboxUI.create('#(title)', '', '', userboxUI.input('#(inputId)', true)), title)
        } else {
          modal.prompt(title, item.default, title, false, item.type);
        }
      }
    }
  })
}

useInputSelectors()

function optPickerHtmlCreate(){
  return new TagString(
    `<div class="user-box user-select">
  <div class="user-row">
    <div class="user-icon user-left-input">
      <input type="checkbox" name="" id="" value="" />
    </div>
    <div class="user-body">
      <div class="user-name">#(title)</div>
      <div class="user-subtext">subtext</div>
    </div>
  </div>
</div>`
    )
  
  return new TagString(
      `
      <div class="option-item-box">
        <div class="option-item-left">
          <input type="checkbox" class="option-item-input">
        </div>
        <div class="option-item-center">
          <div class="option-item-title">Hello</div>
          <div class="option-item-text">Demo</div>
        </div>
      </div>
      `
    )
}

modal.optionsPicker([
  {
    inputId: 'tya',
    value: 'wj',
    attr: {},
    title: 'hrllo',
    text: 'js'
  }], false, optPickerHtmlCreate())