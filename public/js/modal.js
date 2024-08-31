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
    document.body.appendChild(tag.parseElement()[0])
  },
  alert(title, body, bodyClass = '') {
    return new Promise((resolve, reject) => {

      var ID = 'ALRT_' + Math.floor(Math.random() * 888);
      var mainID = ID + '_MAIN';
      var tagstr = this.create(this.title(title),
        (typeof body == 'function' ? body() : body),
        this.rightElem(
          this.button('Close', '', ID)),
        '',
        bodyClass,
        mainID
      );


      this.add(tagstr)
      document.getElementById(ID).onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'bounceOut 0.5s 1';
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
          this.button('Continue', '', ID+'200')),
        '',
        '',
        mainID
      );


      this.add(tagstr)
      document.getElementById(ID).onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'bounceOut 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            document.getElementById(mainID).remove()
            resolve(false)
          }
        }
      }
      document.getElementById(ID+'200').onclick = function() {
        if (document.getElementById(mainID)) {
          document.getElementById(mainID).children[0].style.animation = 'bounceOut 0.5s 1';
          document.getElementById(mainID).children[0].onanimationend = function() {
            document.getElementById(mainID).remove()
            resolve(true)
          }
        }
      }
      
    })
  }
}
