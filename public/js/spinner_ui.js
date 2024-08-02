const spinner = {
  elem: document.querySelector('.preloader'),
  create() {
    return new TagString(`<div class="preloader">
    <div class="spinner">
      <div class="dot1"></div>
      <div class="dot2"></div>
    </div>
    <p>Loading...</p>
  </div>`)
  },
  showPreloader() {
    var self = this
    this.elem = document.querySelector('.preloader');
    if (!this.elem) {
      var box = this.create()
      document.body.appendChild(box.parseElement()[0])
      this.elem = box.parseElement()[0];
    }
    this.elem.style.display = 'flex';
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
