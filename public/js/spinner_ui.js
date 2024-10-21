const spinner = {
  elem: document.querySelector('.preloader'),
  create(text) {
    return new TagString(`<div class="preloader">
    <span class="loader"></span>
    <p>${text}</p>
  </div>`)
  },
  showPreloader(text = '') {
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
    const spinnerOneElem = getComputedStyle(this.elem, ':after');
    const spinnerTwoElem = getComputedStyle(this.elem, ':before');
    // spinnerOneElem
    const self = this;
    return new Promise((resolve) => {
      if (self.elem) {
        var elem = self.elem;
        var a = anime({
          targets: '.preloader p',
          duration: 500,
          opacity: [1, 0],
          easing: 'easeInOutQuad'
        }).finished.then(() => {
          anime({
            targets: '.preloader .loader',
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
