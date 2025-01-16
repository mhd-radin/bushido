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
          this.button('Cancel', 'sec-btn', ID + '_CLS') +
          this.button('Submit', '', ID)),
        '',
        '',
        mainID
      );


      this.add(tagstr)
      // TODO: Merge UNIT A and UNIT B
      // auto focus
      document.getElementById(ID + 'INP').focus()
      // close btn
      document.getElementById(ID + '_CLS').onclick = function() {
        // UNIT A
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            var value = document.getElementById(ID + 'INP').value;
            document.getElementById(mainID).remove()
            resolve(value)
          }
        }
      }
      // confirm btn
      document.getElementById(ID).onclick = function() {
        // UNIT B
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
        if (typeof tagstring == 'function') {
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

        modal.optionsPicker(items, single, customTagstr ? customTagstr : htmlStringModal, data.title ? data
          .title : 'Pick one').then(function(val) {
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
  useDropdown(container, options, pos, onclose) {
    // Create dropdown container
    const dropdownModal = document.createElement("div");
    dropdownModal.className = "dropdown-modal";

    // Populate dropdown with options
    options.forEach((option) => {
      if (option) {

        var iconHtml = '';

        if (option.icon) {
          const itemIcon = document.createElement('i');
          itemIcon.className = 'eva eva-' + option.icon;
          iconHtml = itemIcon.outerHTML;
        }

        const item = document.createElement("a");
        item.textContent = option.label;
        item.href = "#";
        item.innerHTML = '<div>' + item.innerHTML + '</div>'
        item.innerHTML = iconHtml + item.innerHTML;
        item.id = option.id || ""; // Optional id
        item.onclick = (event) => {
          event.preventDefault(); // Prevent default link behavior
          option.clickAction(dropdownModal, () => {
            if (typeof onclose == 'function') onclose();
            dropdownModal.remove()
          });
        };
        dropdownModal.appendChild(item);

      }
    });

    if (pos) {
      if (pos[0]) dropdownModal.style.left = pos[0]
      if (pos[1]) dropdownModal.style.top = pos[1]
      if (pos[2]) dropdownModal.style.right = pos[2]
      if (pos[3]) dropdownModal.style.bottom = pos[3]
    }
    // Append dropdown to container
    container.style.position = "relative"; // Ensure the container is positioned
    container.appendChild(dropdownModal);

    // Close dropdown on outside click
    const handleOutsideClick = (event) => {
      if (!dropdownModal.contains(event.target) && event.target !== container) {
        dropdownModal.remove();
        if (typeof onclose == 'function') onclose();
        document.removeEventListener("click", handleOutsideClick);
      }
    };
    document.addEventListener("click", handleOutsideClick);
  }
}