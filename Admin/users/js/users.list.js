function onpageloadin() {
  bushido.getCollection('accounts').then(function(snapshot) {
    var arr = bushido.toData(snapshot)
    var elem = document.querySelector('.users-list');
    elem.innerHTML = ''
    arr.forEach(function(item, index) {
      var data = item.data();
      var userItemElem = userboxUI.create(
        data.fullname,
        (data.isAdmin == true ? 'Special Access' : data.email),
        (data.avatar ? data.avatar : app.avatarUrl(data.fullname, 'initials', '&radius=40')),
        (data.isAdmin == true ? userboxUI.tag('Admin') : '')).parseElement()[0];
      elem.appendChild(userItemElem);
      userItemElem.onclick = function() {
        openAboutUserPanel(item);
      }
    })
    document.getElementById('bodyTitle').innerHTML = 'Total ' + arr.length + ' users'
  })
}

function createUserInfo(name, email, body, avatar) {
  return new TagString(`
<div class="profile-box">
  <div class="avatar-container">
    <div class="avatar-img">
      <img id="avatar" src="${(avatar ? avatar : app.avatarUrl(name, 'initials', '&radius=50'))}" alt="" class="avatar-photo" />
    </div>
    <div class="basic-info-box">
      <div class="basic-info-item" id="titleName">${name}</div>
      <div class="basic-info-item" id="titleEmail">${email}</div>
    </div>
  </div>
</div>

<div class="edit-box">
  <div class="opt-layout">
    <div class="opt-head">About</div>
    <div class="opt-body">
      ${body}
    </div>
  </div>

  <div class="opt-layout">
    <div class="opt-head">Actions</div>
    <div class="opt-body">
      
      
      <div class="opt-item" onclick="closeAboutUserPanel()">
        <i class="eva eva-log-out-outline opt-item-icon"></i>
        <div class="opt-text-body">
          <div class="opt-title">Close tab</div>
          <div class="opt-subtext">Back to users list</div>
        </div>
        <div class="opt-right">
          <i class="eva eva-chevron-left"></i>
        </div>
      </div>
      
      
      <div class="opt-item danger-opt-item" id="deleteAcc">
        <i class="eva eva-person-delete-outline opt-item-icon"></i>
        <div class="opt-text-body">
          <div class="opt-title">Delete Account</div>
          <div class="opt-subtext">Remove account from server</div>
        </div>
        <div class="opt-right">
          <i class="eva eva-chevron-right"></i>
        </div>
      </div>
      
      
    </div>
  </div>
</div>

`)
}

function createUserInfoProp(text, subtext, icon, right = '') {
  return new TagString(`<div class="opt-item">
  <i class="eva eva-${icon}-outline opt-item-icon"></i>
  <div class="opt-text-body">
    <div class="opt-title">${text}</div>
    <div class="opt-subtext">${subtext}</div>
  </div>
  <div class="opt-right">
    ${right}
  </div>
</div>`)
}

const iconKeys = {
  phone: 'phone',
  fullname: 'person',
  password: 'shield',
  goal: 'award',
  email: 'email',
  dob: 'calendar',
  height: 'upload',
  isAdmin: 'link',
  isPermanent: 'link',
  weight: 'cube',
  address: 'pin'
}

var userslistElem = document.querySelector('.users-list')
var bodyHeaderElem = document.querySelector('.body-header')
var infoUserElem = document.querySelector('.info-user');

function openAboutUserPanel(item) {
  var data = item.data()
  window.location.href = '#' + (data.id || data.fullname);
  var elem = document.querySelector('.info-user');
  if (elem) {

    infoUserElem.classList.toggle('show-screen-mobile', true);
    document.scrollingElement.scrollTop = 0;
    userslistElem.classList.toggle('hide-screen-mobile', true);
    bodyHeaderElem.classList.toggle('hide-screen-mobile', true);

    var pr = '';
    Object.keys(data).forEach(function(key) {
      if (key == 'password' ||
        key == "adminKey" || key == 'avatar') {} else {
        var rightStr = '';
        if (key == 'isPermanent') {
          rightStr = new TagString('<input type ="checkbox"/>').setAttributes({
            id: 'isPermanent'
          })
        }
        pr += createUserInfoProp(key, data[key], iconKeys[key], rightStr)
      }
    })
    elem.innerHTML = createUserInfo(data.fullname, data.email, pr, data.avatar)
  }
}


function closeAboutUserPanel() {
  infoUserElem.classList.toggle('show-screen-mobile', false);
  document.scrollingElement.scrollTop = 0;
  userslistElem.classList.toggle('hide-screen-mobile', false);
  bodyHeaderElem.classList.toggle('hide-screen-mobile', false);
}
window.onhashchange = function(h) {
  if (!window.location.hash) { closeAboutUserPanel() }
}