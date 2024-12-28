// document.querySelectorAll(".nav-item").forEach(function (elem) {
//   const eps = document.querySelector(".elapser");
//   var wd = document.querySelector(".nav-item").getBoundingClientRect().left;
//   console.log(wd);

//   elem.addEventListener("mouseenter", function () {
//     if (!elem.classList.contains("active")) {
//       eps.style.animation = "elapseIn 0.4s 1";
//       eps.style.display = "block";
//       const bbox = elem.getBoundingClientRect();
//       var x = 40 + bbox.left - wd;
//       document.body.style.setProperty("--location-elapser", x + "px");
//     }
//   });
//   elem.addEventListener("mouseleave", function () {
//     eps.style.display = "none";
//   });
// });

document.querySelector(".nav-btn").onclick = function () {
  var x = document.querySelector(".nav-contents");
  if (x.style.display === "none") {
    x.style.display = "flex";
    document.querySelector(".nav-btn ion-icon").name = "close-outline";
  } else {
    x.style.display = "none";
    document.querySelector(".nav-btn ion-icon").name = "menu-outline";
  }
};

window.onresize = function () {
  if (window.innerWidth > 700) {
    var x = document.querySelector(".nav-contents");
    if (x.style.display === "none") {
      document.querySelector(".nav-contents").style.display = "flex";
    }
  }
};
