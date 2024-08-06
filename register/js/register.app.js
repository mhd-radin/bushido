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

const formsID = [
  'form_1',
  'form_2',
  'form_3',
  'form_4'
  ]


class FormSet {
  constructor(state = formsID[0], data = { phone: '+91' }) {
    this.state = state;
    this.data = data;
    this.completed = false;
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

let currentFormSet = new FormSet(formsID[0], {});

if (localStorage.getItem('form_set')) {
  var currentForm = JSON.parse(localStorage.getItem('form_set'));
  currentFormSet = new FormSet(currentForm.state, currentForm.data);
}

showForm(document.getElementById(currentFormSet.state))

document.querySelectorAll('input, textarea').forEach((input, index) => {
  input.onchange = function(e) {
    currentFormSet.set(input.id, input.value);
    saveForm()
  }
  input.value = (typeof currentFormSet.get(input.id) != 'undefined' ? currentFormSet.get(input.id) : '')
})

function saveForm() {
  localStorage.setItem('form_set', JSON.stringify(currentFormSet));
}

function showForm(form) {
  document.querySelectorAll('#' + formsID.join(', #')).forEach(function(elem) {
    if (form.id == elem.id) {
      elem.style.display = 'block'
    } else {
      elem.style.display = 'none'
    }
  })
  if (form.id === formsID[1]) {
    changeTitle('Step Into the Ring with Bushido Boxers Club.')
    changeLog('');
  } else if (form.id === formsID[2]) {
    changeTitle('Begin Your Training at Bushido Boxers Club')
    changeLog('');
  } else if (form.id === formsID[3]) {
    changeTitle('Your Fitness Adventure Begins Here');
    changeLog('');
  }

  if (form.id !== formsID[3]) {
    document.getElementById('backBtn').style.display = 'none';
  } else {
    document.getElementById('backBtn').style.display = 'block';
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


function changeState(nextState) {
  var currentState = currentFormSet.state;
  switch (currentState) {
    case formsID[0]:
      var fullname = document.getElementById('fullname'),
        email = document.getElementById('email'),
        phone = document.getElementById('phone');

      if (!fullname.value) {
        changeLog('Name input is blank, please fill the form correctly');
      } else if (!email.value) {
        changeLog('Email input is blank, please fill the form correctly');
      } else if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || email.value.includes(' ')) {
        changeLog('Invalid email, email format incorrect or contains space. ( eg:- example@gmail.com )')
      } else if (!phone.value) {
        changeLog('Phone number input is blank, please fill the form correctly')
      } else {
        changeLog('Checking availability, please wait...')
        closeForm(function() {
          currentFormSet.state = nextState;
          saveForm();
          showForm(document.getElementById(nextState))
        })
      }
      break;
    case formsID[1]:
      var password = document.getElementById('password'),
        dob = document.getElementById('dob');

      if (!password.value) {
        changeLog('Password input is blank, please fill the form correctly');
      } else if (password.value.length <= 8) {
        changeLog('Password require minimum 8 letters');
      } else if (!dob.value) {
        changeLog('Date of birth input is blank, please fill the form correctly');
      } else {
        closeForm(function() {
          currentFormSet.state = nextState;
          saveForm();
          showForm(document.getElementById(nextState))
        })
      }
      break;
    case formsID[2]:
      var address = document.getElementById('address'),
        height = document.getElementById('height'),
        weight = document.getElementById('weight');

      if (!address.value) {
        changeLog('Address input is blank, please fill the form correctly...');
      } else if (address.value.length <= 10) {
        changeLog('Address require minimum 10 letters');
      } else if (!height.value) {
        changeLog('Height input is blank. please tell about your height in centimetres');
      } else if (height.value < 15 || height.value > 400) {
        changeLog('Wrong height, please tell your height in centimetres ');
      } else if (!weight.value) {
        changeLog('Weight input is blank. please tell about your weight in Kilogram');
      } else {
        closeForm(function() {
          currentFormSet.state = nextState;
          saveForm();
          showForm(document.getElementById(nextState))
        });
      }
      break;
    case formsID[3]:
      var goal = document.getElementById('goal');

      if (!goal.value || goal.value < 8) {
        changeLog('Goal input is blank or require minimum 8 letters');
      } else {
        currentFormSet.completed = true;
        alert(JSON.stringify(currentFormSet))
      }
      break;
  }

  saveForm()
}


document.getElementById('nextBtn').onclick = function() {
  changeState(formsID[currentFormSet.index() + 1]);
}

document.getElementById('backBtn').onclick = function() {
  currentFormSet.state = formsID[0];
  saveForm();
  if (spinner) {
    spinner.showPreloader()
  }

  setTimeout(function() {
    window.location.reload()
  }, 200)
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
      //elem.style.animationDelay = '0s';
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