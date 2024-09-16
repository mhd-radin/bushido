const userboxUI = {
  create(name, subname, imgURL, right = '') {
    return new TagString(`<div class="user-box">
  <div class="user-row">
    <div class="user-icon">
      <img src="${imgURL}" alt="" class="user-image">
    </div>
    <div class="user-body">
      <div class="user-name">${name}</div>
      <div class="user-subtext">${subname}</div>
      <div class="user-right">
        ${right}
      </div>
    </div>
  </div>
</div>`)
  },
  tag(tagName){
    return new TagString(`<div class="user-tag">${tagName}</div>`)
  },
  icon(iconNameWithoutEva){
    return new TagString(`<i class="eva eva-${iconNameWithoutEva}"></i>`)
  },
  input(id='', isRadio = false){
    return new TagString(`<input type="${isRadio ? 'radio' : 'checkbox'}" id="${id}" />`);
  },
  pickerBox(id, title, subtext, isRadio) {
    return new TagString(
      `<div class="user-box user-select">
    <div class="user-row">
      <div class="user-icon user-left-input">
        <input type="${isRadio ? 'radio' : 'checkbox'}" name="" id="${id}" value="" />
      </div>
      <div class="user-body">
        <div class="user-name">${title}</div>
        <div class="user-subtext">${subtext}</div>
      </div>
    </div>
  </div>`
    )
  }
}