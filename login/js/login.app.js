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
  var params = location.search.replace('?', '');
  var paramsString = '{"' + params.replaceAll("&", '","').replaceAll('=', '":"') + '"}';
  if (params == '') {} else {
    var objectParams = JSON.parse(paramsString);
    objectParams = objectParams
    if (objectParams.email == undefined || objectParams.pw == undefined || objectParams.enc == undefined) {

    } else {
      spinner.showPreloader('Setting up...')
      signIn(objectParams.email, objectParams.pw)
    }
  }
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

document.getElementById('register').onclick = function() {
  menu.close(document.querySelector('#login')).then(function() {
    spinner.showPreloader();
    setTimeout(function() {
      window.location.href = '../register';
    }, 200)
  })
}

function signIn(email, pw) {
  bushido.useQuery('accounts', [
    ['email', '==', email],
    ['password', '==', pw]
    ]).then(function(snapshot) {
    var arr = bushido.toData(snapshot);
    if (arr.length == 0) {
      alert('Sign in faild...');
    } else {
      var data = arr[0].data();
      caches.open('user').then(function(cache) {
        cache.put('about-user', new Response(JSON.stringify(data), {
          headers: { 'Content-type': 'application/json' }
        })).catch((err) => {
          alert(err)
        }).then(() => {
          cache.keys('admin-access-key').then(function(t) {
            alert(t[0].url)
            localStorage.setItem('userUrl', t[0].url);
          })
        })
      })
    }
  })
}