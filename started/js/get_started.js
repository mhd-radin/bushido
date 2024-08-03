function onpageloadin() {
  document.querySelectorAll('.main-section *').forEach(function(elem) {
    elem.style.animationPlayState = 'running';
  })

  var welcomeTextElem = app.lettersToElem(document.querySelector('.welcome-text'))
  anime.timeline({
    loop: false
  }).add({
    targets: '.welcome-text',
    duration: 100,
    easing: 'easeOutExpo',
    opacity: [0, 1],
  }).add({
    targets: '.welcome-text .letter',
    delay: (el, i) => (50 * i),
    opacity: [0, 1],
    translateY: ["1.1em", 0],
    //translateX: ["0.55em", 0],
    translateZ: 0,
    //rotateZ: [180, 0],
    duration: 750,
    easing: "easeOutExpo",
  }).add({
    targets: '.welcome-text',
    duration: 300,
  })

  app.lettersToElem(document.querySelector('.large-text'))
  anime.timeline({ loop: false }).add({
    targets: '.large-text .letter',
    duration: 200,
    delay: (el, i) => (50 * i),
    easing: "easeOutExpo",
    opacity: [0, 1],
    scaleX: [0.4, 1],
    complete: function() {
      app.preventLetters(document.querySelector('.large-text'))
    }
  })
}

function started() {
  app.redirectWithPreloader('/')
}