const formsID = ["form_1", "form_2", "form_3", "form_4"];

class FormSet {
  constructor(state = formsID[0], data = { phone: "+91" }, completed = false) {
    this.state = state;
    this.data = data;
  }

  set(key, name) {
    this.data[key] = name;
  }

  get(key) {
    return this.data[key];
  }

  index() {
    if (formsID) {
      return formsID.indexOf(this.state);
    }
  }
}

let currentFormSet = new FormSet(formsID[0], {});

// if (localStorage.getItem("form_set")) {
//   var currentForm = JSON.parse(localStorage.getItem("form_set"));
//   currentFormSet = new FormSet(
//     currentForm.state,
//     currentForm.data,
//     currentFormSet.completed
//   );
// }

showForm(document.getElementById(currentFormSet.state));

document.querySelectorAll("input, textarea").forEach((input, index) => {
  input.onchange = function(e) {
    currentFormSet.set(input.id, input.value);
    saveForm();
  };
  input.value =
    typeof currentFormSet.get(input.id) != "undefined" ?
    currentFormSet.get(input.id) :
    "";
});

function saveForm() {
  localStorage.setItem("post_form_set", JSON.stringify(currentFormSet));
}

function showForm(form) {
  document.querySelectorAll("#" + formsID.join(", #")).forEach(function(elem) {
    if (form.id == elem.id) {
      elem.style.display = "block";
    } else {
      elem.style.display = "none";
    }
  });
  if (form.id === formsID[1]) {
    changeTitle("Add basic information");
    changeLog("");
  } else if (form.id === formsID[2]) {
    changeTitle("Add image");
    changeLog("");
  } else if (form.id === formsID[3]) {
    changeTitle("Preview of post");
    changeLog("");
  }

  if (form.id !== formsID[2]) {
    document.getElementById("nextBtn").innerHTML = "Forward";
  } else {
    document.getElementById("nextBtn").innerHTML = "Show Preview";
  }

  if (form.id != formsID[0]) {
    document.getElementById("backBtn").style.display = "block";
  } else {
    document.getElementById("backBtn").style.display = "none";
  }
}

function changeLog(log) {
  //document.getElementById("logger").innerHTML = log;
}

function changeTitle(msg) {
  document.getElementById("title").innerHTML = msg;
  app.lettersToElem(document.getElementById("title"));
  anime.timeline({ loop: false }).add({
    targets: "#title .letter",
    duration: 450,
    delay: (el, i) => 40 * i,
    easing: "easeOutExpo",
    opacity: [0, 1],
    scale: [0.4, 1],
    keyframes: [
      {
        filter: "blur(1px)",
      },
      {
        filter: "blur(0px)",
      },
    ],
    complete: function() {
      setTimeout(function() {
        app.preventLetters(document.querySelector("#title"));
      }, 50);
    },
  });
}

function changeState(nextState) {
  var currentState = currentFormSet.state;
  switch (currentState) {
    case formsID[0]:
      currentFormSet.state = nextState;
      saveForm();
      showForm(document.getElementById(nextState));
      break;
    case formsID[1]:
      currentFormSet.state = nextState;
      saveForm();
      showForm(document.getElementById(nextState));

      break;
    case formsID[2]:

      currentFormSet.state = nextState;
      saveForm();
      showForm(document.getElementById(nextState));
      break;
    case formsID[3]:
      modal.alert()
      break;
  }

  saveForm();
}

document.getElementById("nextBtn").onclick = function() {
  changeState(formsID[currentFormSet.index() + 1]);
};

document.getElementById("backBtn").onclick = function() {
  currentFormSet.state = formsID[0];
  saveForm();
  if (spinner) {
    spinner.showPreloader();
  }

  setTimeout(function() {
    window.location.reload();
  }, 200);
};

