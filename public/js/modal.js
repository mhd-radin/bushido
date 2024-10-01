const modal = {
  create(head, body, footer, modalClass, bodyClass, id) {
    return new TagString(`
<div class="modal-back" id="${id}">
  <div class="modal ${modalClass}">
    <div class="modal-head">
      ${head}
    </div>
    <div class="modal-body ${bodyClass}">
      ${body}
    </div>
    <div class="modal-footer">
    ${footer}
    </div>
  </div>
</div>
`)
  },
  title(title) {
    return new TagString(`<div class="modal-title">${title}</div>`)
  },
  rightElem(body) {
    return new TagString(`<div class="modal-right">${body}</div>`)
  },
  button(body, className, id) {
    return new TagString(`<button class="${className}" id="${id}">${body}</button>`)
  },
  add(tag) {
    return document.body.appendChild(tag.parseElement()[0])
  },
  alert(title, body, bodyClass = '') {
    return new Promise((resolve, reject) => {

      var ID = 'ALRT_' + Math.floor(Math.random() * 888);
      var mainID = ID + '_MAIN';
      var tagstr = this.create(this.title(title),
        (typeof body == 'function' ? body(mainID, ID) : body),
        this.rightElem(
          this.button('Close', '', ID)),
        '',
        bodyClass,
        mainID
      );


      this.add(tagstr)
      document.getElementById(ID).onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            document.getElementById(mainID).remove()
            resolve()
          }
        }
      }
    })
  },
  confirm(title, body) {
    return new Promise((resolve, reject) => {

      var ID = 'CNFRM_' + Math.floor(Math.random() * 888);
      var mainID = ID + '_MAIN';
      var tagstr = this.create(this.title(title),
        body,
        this.rightElem(
          this.button('Close', 'sec-btn', ID) +
          this.button('Continue', '', ID + '200')),
        '',
        '',
        mainID
      );


      this.add(tagstr)
      document.getElementById(ID).onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            document.getElementById(mainID).remove()
            resolve(false)
          }
        }
      }
      document.getElementById(ID + '200').onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            document.getElementById(mainID).remove()
            resolve(true)
          }
        }
      }

    })
  },
  prompt(title, value = '', placeholder = false, isTextarea = false, type = 'text') {
    return new Promise((resolve, reject) => {

      var ID = 'PRMPT_' + Math.floor(Math.random() * 888);
      var mainID = ID + '_MAIN';
      var input = new TagString(isTextarea ? '<textarea></textarea>' : '<input type="text" />').setAttributes({
        id: ID + 'INP',
        value,
        "class": 'modal-input',
        placeholder: placeholder ? placeholder : title,
        type,
      })
      var tagstr = this.create(this.title(title),
        input,
        this.rightElem(
          this.button('Close', '', ID)),
        '',
        '',
        mainID
      );


      this.add(tagstr)
      document.getElementById(ID+ 'INP').focus()
      document.getElementById(ID).onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            var value = document.getElementById(ID + 'INP').value;
            document.getElementById(mainID).remove()
            resolve(value)
          }
        }
      }
    })
  },
  optionsPicker(values = [
  {
    inputId: '',
    attr: {},
    value: ''
  }
  ], single = false, tagstring = new TagString(), title = 'Select a value') {
    return new Promise((resolve, reject) => {
      var strResult = '';
      values.forEach(function(data) {
        var finalTagstring = tagstring
        if (typeof tagstring == 'function'){
          finalTagstring = tagstring(data);
        }
        if (single && data.attr) {
          data.attr.name = 'single';
        }
        var elem = finalTagstring.parseElement()[0]
        Object.keys(data.attr).forEach((att) => {
          elem.querySelector('input').setAttribute(att, data.attr[att]);
        })
        finalTagstring = new TagString(elem.outerHTML);
        strResult += finalTagstring.eval(data)
      })

      var ID = 'OPTPICKER_' + Math.floor(Math.random() * 888);
      var mainID = ID + '_MAIN';
      var tagstr = this.create(this.title(title),
        strResult,
        this.rightElem(
          this.button('Select', '', ID)),
        '',
        '',
        mainID
      );


      this.add(tagstr)


      document.getElementById(ID).onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            var out = [];
            var json = {}
            values.forEach(function(data) {
              if (document.getElementById(data.inputId).checked) {
                out.push(data.value)
              }
            })

            resolve(single ? out[0] : out)
            document.getElementById(mainID).remove()
          }
        }
      }
    })
  },
  datePicker(selectBy = [{
    type: 'day',
    subtract: 10,
    add: 10,
    format: 'DD',
    title: 'Pick one'
  }], single = true, from = new Date(), customTagstr = false) {
    return new Promise((resolve, reject) => {
      const selectedValues = []
      var htmlStringModal = new TagString(`
       <div>
       #(value)
       <input id='#(inputId)' type='radio'/>
       </div>
      `);
      var index = 0;

      function pickDate(data) {
        var items = [];

        if (data.subtract) {
          for (var i = data.subtract; i > 0; i--) {
            var dt = dayjs(from).subtract(i, data.type).format(data.format);
            items.push({
              attr: {},
              inputId: dt,
              value: dt,
              type: data.type,
              format: data.format,
              index: i,
            })
          }
        }

        if (data.add) {
          for (var i = 0; i < data.add; i++) {
            var dt = dayjs(from).add(i, data.type).format(data.format);
            items.push({
              attr: {},
              inputId: dt,
              value: dt,
              type: data.type,
              format: data.format,
              index: i,
            })
          }
        }

        modal.optionsPicker(items, single, customTagstr ? customTagstr : htmlStringModal, data.title ? data.title : 'Pick one').then(function(val) {
          index += 1;
          selectedValues.push(val)
          if (selectBy[index]) {
            pickDate(selectBy[index])
          } else {
            resolve(selectedValues)
          }
        })
      }

      pickDate(selectBy[index])
    })
  },
}

