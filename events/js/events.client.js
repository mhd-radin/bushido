app.validUser().catch(() => {
  app.redirectWithPreloader("../register");
});

function onpageloadin() {
  const targetElements = document.querySelectorAll(".image-card"); // Element to observe
  targetElements.forEach(function (targetElement) {
    observer.observe(targetElement);
  });

  document.querySelectorAll(".note-card").forEach(function (targetElement) {
    microObserver.observe(targetElement);
  });
}

var rotate = 0;

document.querySelectorAll(".note-card").forEach(function (elem) {
  function handleMoves(e) {
    let X = 0,
      Y = 0;
    if (e.touches || e.changedTouches) {
      X = e.changedTouches[0].clientX;
      Y = e.changedTouches[0].clientY;
    } else {
      X = e.clientX;
      Y = e.clientY;
    }
    var y = Y - elem.offsetTop;

    elem.querySelector(".note-ripple").style.display = "block";
    elem.querySelector(".note-ripple").style.left =
      X - elem.offsetLeft - elem.offsetWidth / 1 + "px";
    elem.querySelector(".note-ripple").style.top = y - elem.clientHeight + "px";
    rotate = Math.cos(X / 100) * Math.sin(Y / 100);

    elem.querySelector(".note-ripple").style.transform =
      "translate(40px, 40px) rotate(" + rotate * 100 + "deg)";
  }
  elem.addEventListener("mousemove", handleMoves);
  elem.addEventListener("touchmove", handleMoves);
  
  function off() {
    elem.querySelector(".note-ripple").style.display = "none";
  }
  elem.addEventListener("mouseleave", off);
  elem.addEventListener("touchend", off);
});
