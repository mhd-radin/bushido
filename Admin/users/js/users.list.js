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

function openAboutUserPanel(item) {
  var data = item.data()
  var elem = document.querySelector('.info-user');
  if (elem) {
    //if (window.innerWidth < 650) {
    document.querySelector('.users-list').classList.remove('mobile-on');
    document.querySelector('.body-header').classList.remove('mobile-on');
    document.querySelector('.users-list').classList.add('mobile-off');
    document.querySelector('.body-header').classList.add('mobile-off');

    document.querySelector('.info-user').classList.remove('mobile-off');
    document.querySelector('.info-user').classList.add('mobile-on');
    //}
    elem.style.display = 'block';

    var pr = '';
    Object.keys(data).forEach(function(key) {
     // if (key != 'password' || key != "adminKey") {

      //} else {
        var rightStr = '';
        if (key == 'isPermanent') {
          rightStr = new TagString('<input type="checkbox" />').setAttributes({
            id: 'isPermanent'
          })
        }
        pr += createUserInfoProp(key + '  : ' + data[key], iconKeys[key], rightStr)
     // }
    })
    elem.innerHTML = createUserInfo(data.fullname, data.email, pr)
  }
}


function closeAboutUserPanel() {
  document.querySelector('.users-list').classList.replace('mobile-off', 'mobile-on');
  document.querySelector('.body-header').classList.replace('mobile-off', 'mobile-on');
  document.querySelector('.users-list').classList.add('mobile-on');
  document.querySelector('.body-header').classList.add('mobile-on');

  document.querySelector('.info-user').classList.replace('mobile-on', 'mobile-off');
  document.querySelector('.info-user').classList.add('mobile-off');
}