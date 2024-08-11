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
  }
}