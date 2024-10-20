function onpageloadin() {
  anime.set(".large-text", {
    visibility: "hidden",
  });
  var logoTxt = document.querySelector('.logo-anim-txt')
  var logoTxtRect = logoTxt.getBoundingClientRect();
  app.lettersToElem(logoTxt)
  anime.timeline({
    loop: 1,
    easing: 'easeOutExpo',
    autoplay: true
  }).add({
    targets: '.logo-anim-slider',
    width: ['100%', '0%'],
    duration: 1200,
    easing: 'easeOutExpo'
  });

  anime.timeline({
    loop: false,
    easing: 'easeInExpo',
    direction: 'alternative',
    autoplay: true,
    duration: 1400
  }).add({
    targets: '.logo-anim-dot',
    keyframes: [{
      width: ['40px', '120px'],
      left: ['80%', '46%'],
      easing: 'easeInExpo'
    }, {
      width: '40px',
      left: '20%',
      easing: 'easeOutExpo'
    }]
  }).add({
    targets: '.logo-anim-dot',
    keyframes: [{
      width: '120px',
      left: '46%',
      height: '20px',
      // scale: '0.6',
      easing: 'easeInExpo',
      backgroundColor: '#61AFFF'
      }, {
      width: '10px',
      height: '10px',
      left: (logoTxtRect.left + logoTxtRect.width + 5) + 'px',
      top: (logoTxtRect.top + logoTxtRect.height - 23) + 'px',
      // scale: '0.3',
      easing: 'easeOutElastic',
      backgroundColor: '#3B4182'
      }],
    duration: 1000,
    backgroundColor: ['#61AFFF', '#3B4182']
  }, '-=100').add({
    targets: '.logo-anim-txt .letter',
    opacity: [0, 1],
    delay: (el, i) => 50 * i,
    scale: [0.8, 1],
    duration: 80,
    keyframes: [{
      left: ['53%', '50%']
    }]
  }, '-=700').add({
    targets: '.logo-anim-dot',
    duration: 200,
    opacity: 0,
  }).add({
    targets: '.logo-anim-slider',
    width: ['0%', '100%'],
    duration: 1200,
    easing: 'easeInExpo',
  }).add({
    targets: '.logo-anim-txt',
    duration: 200,
    opacity: 0,
  }).add({
    targets: '.logo-anim-slider',
    duration: 1200,
    easing: 'easeOutExpo',
    keyframes: [{
      left: '100%',
      width: ['100%', '0%']
    }],
    complete() {
      document.querySelector('.logo-anim-bg').remove();

      setTimeout(function() {
        var welcomeTextElem = app.lettersToElem(
          document.querySelector(".welcome-text")
        );
        anime
          .timeline({
            loop: false,
          })
          .add({
            targets: ".welcome-text",
            delay: 200,
            duration: 500,
            easing: "easeInExpo",
            scaleY: [1, 1],
            translateX: ["-80%", 0],
            opacity: [0, 1],
          })
          .add({
            targets: ".welcome-text .letter",
            delay: (el, i) => 50 * i,
            opacity: [0, 1],
            translateX: ["-40px", 0],
            duration: 700,
            keyframes: [
              {
                filter: "blur(2px)",
              },
              {
                filter: "blur(0px)",
              },
            ],
            easing: "easeInExpo",
          })
          .add({
            targets: ".welcome-text",
            duration: 50,
            begin: () => {
              anime.set(".large-text", {
                visibility: "visible",
              });
            },
            complete: () => {
              anime.set(".large-text", {
                visibility: "visible",
              });
              app.wordsToElem(document.querySelector(".large-text"));
              anime.timeline({ loop: false }).add({
                targets: ".large-text .word",
                duration: 950,
                delay: (el, i) => 200 * i,
                easing: "easeOutExpo",
                opacity: [0, 1],
                // scale: [0.4, 1],
                translateY: ["30px", "0px"],
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
                    document
                      .querySelectorAll(".indro-text, .reg-btn")
                      .forEach(function(elem) {
                        elem.style.animationPlayState = "running";
                      });
                    setTimeout(function() {
                      app.preventLetters(document.querySelector(".large-text"));
                    }, 1000);
                  }, 50);
                },
              });
            },
          });
      }, 200);
    }
  })
}

function started() {
  app.redirectWithPreloader("register");
}