function onpageloadin() {
  setTimeout(function() {
    document.querySelectorAll('.indro-text, .reg-btn').forEach(function(elem) {
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
      translateZ: 0,
      duration: 700,
      easing: "easeOutExpo",
    }).add({
      targets: '.welcome-text',
      duration: 50,
    })

    app.lettersToElem(document.querySelector('.large-text'))
    anime.timeline({ loop: false }).add({
      targets: '.large-text .letter',
      duration: 450,
      delay: (el, i) => (80 * i),
      easing: "easeOutExpo",
      opacity: [0, 1],
      scale: [0.4, 1],
      complete: function() {
        setTimeout(function() {
          app.preventLetters(document.querySelector('.large-text'))
        }, 50)
      }
    })
  }, 200)
}

function started() {
  app.redirectWithPreloader('register')
}