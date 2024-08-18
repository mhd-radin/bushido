function onpageloadin() {
  anime.set('.large-text', {
    visibility: 'hidden'
  })

  setTimeout(function() {
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
      translateZ: 0,
      duration: 700,
      keyframes: [{
        filter: 'blur(1px)'
      }, {
        filter: 'blur(0px)'
      }],
      easing: "easeOutExpo",
    }).add({
      targets: '.welcome-text',
      duration: 50,
      begin: () => {
        anime.set('.large-text', {
          visibility: 'visible'
        })
      },
      complete: () => {
        anime.set('.large-text', {
          visibility: 'visible'
        });
        app.wordsToElem(document.querySelector('.large-text'))
        anime.timeline({ loop: false }).add({
          targets: '.large-text .word',
          duration: 450,
          delay: (el, i) => (80 * i),
          easing: "easeOutExpo",
          opacity: [0, 1],
          //scaleY: [0.4, 1],
          translateY: ['30px', '0px'],
          keyframes: [{
            filter: 'blur(1px)'
          }, {
            filter: 'blur(0px)'
          }],
          complete: function() {
            setTimeout(function() {
              document.querySelectorAll('.indro-text, .reg-btn').forEach(function(elem) {
                elem.style.animationPlayState = 'running';
              })
              setTimeout(function(){
              app.preventLetters(document.querySelector('.large-text'))},1000)
            }, 50)
          }
        })
      }
    })
  }, 200)
}

function started() {
  app.redirectWithPreloader('register')
}