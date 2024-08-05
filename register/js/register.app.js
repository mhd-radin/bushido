function onpageloadin() {
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
  constructor(state = formsID[0], data = {}) {
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
    console.log(form.id, currentFormSet.state, elem.id)
    if (form.id == elem.id) {
      elem.style.display = 'block'
    } else {
      elem.style.display = 'none'
    }
  })
}

function changeState(nextState) {
  var currentSate = currentFormSet.state;
  switch (currentSate) {
    case formsID[0]:
      currentFormSet.state = nextState;
      showForm(document.getElementById(nextState))
      break;
    case formsID[1]:
      currentFormSet.state = nextState;
      showForm(document.getElementById(nextState))
      break;
    case formsID[2]:
      currentFormSet.state = nextState;
      showForm(document.getElementById(nextState))
      break;
  }

  saveForm()
}

document.getElementById('nextBtn').onclick = function() {
  changeState(formsID[currentFormSet.index() + 1])
}