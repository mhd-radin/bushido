const spinner = {
  elem: document.querySelector('.preloader'),
  create(text) {
    return new TagString(`<div class="preloader">
    <div class="spinner">
      <div class="dot1"></div>
      <div class="dot2"></div>
    </div>
    <p>${text}</p>
  </div>`)
  },
  showPreloader(text = 'Loading...') {
    var self = this
    this.elem = document.querySelector('.preloader');
    if (!this.elem) {
      var box = this.create(text)
      var parsedElem = box.parseElement()[0];
      document.body.appendChild(parsedElem)
      this.elem = parsedElem;
    }
    this.elem.style.display = 'flex';
  },
  changeText(text){
    this.elem.querySelector('p').innerHTML = text;
  },
  removePreloader() {
    return new Promise((resolve) => {
      if (this.elem) {
        var elem = this.elem;
        var a = anime({
          targets: '.preloader p',
          duration: 500,
          opacity: [1, 0],
          easing: 'easeInOutQuad'
        }).finished.then(() => {
          anime({
            targets: '.preloader .dot1, .preloader .dot2',
            easing: 'easeInOutQuad',
            duration: 500,
            loop: false,
            opacity: [1, 0],
            scale: ['1, 1', '0, 0'],
            delay: (e, i) => (350 * i),
          })

          anime({
            targets: '.preloader',
            easing: 'easeInOutQuad',
            duration: 200,
            opacity: [1, 0],
            delay: 500,
            scaleX: [1, 0.8],
            scaleY: [1, 0.8]
          }).finished.then(() => {
            elem.remove();
            resolve(0)
          });
        })
      }
    })
  }
}
