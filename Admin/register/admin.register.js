const cssAnimListQuery = [
    '.reg-body h2',
    '.reg-body p',
    '.input-box label',
    '.input-icon',
    '.input-icon .eva',
    '.form input, .form textarea',
    '.right-elems'
    ]
const delayScaleChild = [
    0,
    0,
    1,
    1,
    1,
    1,
    1
    ]

const baseDelayChild = [
     0,
     200,
     1200,
     850,
     1250,
     450,
     850
    ]

const delayScale = 80;

function onpageloadin() {

  cssAnimListQuery.forEach(function(query, i) {
    var delayScalePos = delayScaleChild[i];
    var baseDelayPos = baseDelayChild[i];

    if (delayScalePos === 0) {
      var elem = document.querySelector(query);
      elem.style.animationDelay = baseDelayPos + 'ms'
      elem.style.animationPlayState = 'running';
    } else {
      var elems = document.querySelectorAll(query).forEach(function(elem, eIndex) {
        var elemStyle = window.getComputedStyle(elem, null);
        var currentDelay = elemStyle.getPropertyValue('animation-delay');

        elem.style.animationDelay = ((parseInt(currentDelay.replace('s', '')) * 1000) + (delayScale * eIndex) + 'ms');
        elem.style.animationPlayState = 'running';
      })
    }
  })

  //menu.close(document.querySelector('.menubox .menu-item'), 'preview')
}


function changeLog(log) {
  document.getElementById('logger').innerHTML = log;
  app.lettersToElem(document.getElementById('logger'))
  anime.timeline({ loop: false }).add({
    targets: '#logger .letter',
    duration: 450,
    delay: (el, i) => (40 * i),
    easing: "easeOutExpo",
    opacity: [0, 1],
    scale: [0.4, 1],
    keyframes: [{
      filter: 'blur(1px)'
      }, {
      filter: 'blur(0px)'
      }],
    complete: function() {
      setTimeout(function() {
        app.preventLetters(document.querySelector('#logger'))
      }, 50)
    }
  })
}

function changeTitle(msg) {
  document.getElementById('title').innerHTML = msg;
  app.lettersToElem(document.getElementById('title'))
  anime.timeline({ loop: false }).add({
    targets: '#title .letter',
    duration: 450,
    delay: (el, i) => (40 * i),
    easing: "easeOutExpo",
    opacity: [0, 1],
    scale: [0.4, 1],
    keyframes: [{
      filter: 'blur(1px)'
      }, {
      filter: 'blur(0px)'
      }],
    complete: function() {
      setTimeout(function() {
        app.preventLetters(document.querySelector('#title'))
      }, 50)
    }
  })
}


function closeForm(onfinish) {
  let query = [
      '#' + document.getElementById(currentFormSet.state).id + ' input',
      '#' + document.getElementById(currentFormSet.state).id + ' textarea',
      '#' + document.getElementById(currentFormSet.state).id + ' .input-box label',
      '#' + document.getElementById(currentFormSet.state).id + ' .eva',
      '#' + document.getElementById(currentFormSet.state).id + ' .input-icon',
    ];

  document.querySelectorAll(query.join(', ')).forEach(function(elem) {
    elem.style.animationDirection = 'reverse'
    var snapshotStyle = window.getComputedStyle(elem).getPropertyValue('animation')

    elem.style.animation = 'none';
    setTimeout(function() {
      elem.style.animation = snapshotStyle;
      elem.style.animationDelay = '0s';
      elem.onanimationend = function() {
        elem.style.display = 'none';
        elem.style.animationDirection = 'forward';
        if (typeof onfinish == 'function') {
          onfinish()
        }
      }
    }, 100)
  })
}


class FormSet {
  constructor(state = formsID[0], data = {}, completed = false) {
    this.state = state;
    this.data = data;
    if (!this.data.isAdmin) {
      this.set('isAdmin', true)
    }
    if (!this.data.isPermanent) {
      this.set('isPermanent', true)
    }
    this.completed = completed;
  }

  set(key, name) {
    this.data[key] = name;
  }

  get(key) {
    return this.data[key];
  }

  index() {
    if (formsID) {
      return formsID.indexOf(this.state)
    }
  }
}



document.getElementById('nextBtn').onclick = function() {
  var form_set = new FormSet('default');
  var name = document.getElementById('fullname'),
    adminKeyInp = document.getElementById('key'),
    password = document.getElementById('password');

  if (!name.value) {
    changeLog('name input is blank.')
  } else if (!adminKeyInp.value) {
    changeLog('admin key is wrong.')
  } else if (!password.value) {
    changeLog('personal password input is blank');
  } else {
    form_set.set('fullname', name.value);
    form_set.set('adminKey', adminKeyInp.value);
    var encrypted = CryptoJS.AES.encrypt(password.value, config.ENC_KEY).toString();
    form_set.set('password', encrypted);

    if (typeof spinner != 'undefined') {
      spinner.showPreloader('Verifying...');
    }
    bushido.useQuery('adminKey', [
      ['key', '==', adminKeyInp.value]
      ]).then(function(snapshot) {
      var data = bushido.toData(snapshot);
      if (data.length == 0) {
        alert("doesn't match admin key")
      } else {
        var obj = data[0].data()
        if (obj.key == adminKeyInp.value) {
          const key = 'ADMN_' + Math.floor(Math.random() * 9999) + '_AG' + (['ABV', 'AKC', 'ZSO', 'KML', 'OPT'][Math.floor(Math.random() * 5)]) + '_AWq67/' + (['Uwes5', 'Ksn74', 'amFw8n', 'Wesy6', '7she73'][Math.floor(Math.random() * 5)]);

          if (typeof spinner != 'undefined') {
            spinner.changeText('Verified. Connecting to server...');
          }

          bushido.set(('accounts/ADMN_' + Math.floor(Math.random() * 999999)), form_set.data).then(() => {
            // caches.open('admin').then(function(cache) {
            //   cache.put('admin-access-key', new Response(JSON.stringify({ key }), {
            //     headers: { 'Content-type': 'application/json' }
            //   })).catch((err) => {
            //     alert(err)
            //   }).then(() => {
            //     cache.keys('admin-access-key').then(function(t) {
            //       localStorage.setItem('adminUrl', t[0].url)
            //       window.location.href = '../attendance';
            //     })
            //   })
          app.saveData('admin', 'admin-access-key', {key}, 'adminUrl', false).then(()=>{
            window.location.href = '../attendance';
            changeTitle('Welcome to Attendance Manager');
            changeLog('Welcome to Attendance Manager');
            }).catch((err) => {
              alert(err)
            });
            localStorage.setItem('adminKey', key)
          }).catch((err) => {
            alert(err)
          });
        } else {
          alert("doesn't match admin key")
        }
      }
    })
  }
}