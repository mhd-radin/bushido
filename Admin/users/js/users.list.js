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
        'https://api.dicebear.com/9.x/initials/svg?seed=' + data.fullname + '&radius=40',
        (data.isAdmin == true ? userboxUI.tag('Admin') : '')).parseElement()[0];
      elem.appendChild(userItemElem);
      userItemElem.onclick = function() {
        openAboutUserPanel(item);
      }
    })
    document.getElementById('bodyTitle').innerHTML = 'Total ' + arr.length + ' users'
  })
}

function createUserInfo(name, email, body) {
  return new TagString(`
  <div class="info-header">
          <img src="https://api.dicebear.com/9.x/initials/svg?seed=${name}&radius=40" alt="" />
          <h2 class="info-name">${name}</h2>
          <p class="info-email">${email}</p>
        </div>
        <div class="info-body">
          ${body}
        </div>
        <div class="info-right-foot">
          <button class="sec-btn" onclick="closeAboutUserPanel()">Close</button>
          <button>Update</button>
        </div>
  `)
}

function createUserInfoProp(text, icon, right = '') {
  return new TagString(`<div class="info-prop">
            <i class="eva eva-${icon}-outline"></i>
            <span>${text}</span>
            <span class="info-right">${right}</span>
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
  var elem = document.querySelector('.info-user');
  if (elem) {
    if (window.innerWidth < 650) {
      elem.style.display = 'block';
      document.scrollingElement.scrollTop = 0;
      userslistElem.style.display = 'none'
      bodyHeaderElem.style.display = 'none'
    }
    var pr = '';
    Object.keys(data).forEach(function(key) {
      if (key == 'password' || key == "adminKey") {

      } else {
        var rightStr = '';
        if (key == 'isPermanent') {
          rightStr = new TagString('<input type="checkbox" />').setAttributes({
            id: 'isPermanent'
          })
        }
        pr += createUserInfoProp(key + '  : ' + data[key], iconKeys[key], rightStr)
      }
    })
    elem.innerHTML = createUserInfo(data.fullname, data.email, pr)
  }
}


function closeAboutUserPanel() {
  if (window.innerWidth < 650) {
    infoUserElem.style.display = 'none';
    document.scrollingElement.scrollTop = 0;
    userslistElem.style.display = 'block'
    bodyHeaderElem.style.display = 'block'
  }
}