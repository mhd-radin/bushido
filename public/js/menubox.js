if (document.querySelector('.menubox')) {

}

const menu = {
  close(menuitemElem = document.body, cls = 'preview') {
    return new Promise((resolve, reject) => {

      if (typeof menuitemElem != 'undefined') {

        function done() {

        }

        if (typeof anime != 'undefined') {
          let timeline = anime.timeline({
            loop: false,
            easing: 'easeInOutQuad',
          });
          let snapshotStyle = window.getComputedStyle(menuitemElem, null);
          let elemQuery = '.menubox #' + menuitemElem.id;

          timeline.add({
            targets: menuitemElem.querySelector('.menu-item-text'),
            duration: 100,
            easing: 'easeOutExpo',
            opacity: 0,
          }).add({
            targets: menuitemElem,
            duration: 100,
            easing: 'easeOutExpo',
            width: 30,
            padding: 0,
            backgroundColor: {
              value: [snapshotStyle.getPropertyValue('background-color'), '#dbdbdb'],
              duration: 100,
              easing: 'easeOutExpo'
            },
          }).add({
            targets: menuitemElem.querySelector('.eva'),
            duration: 200,
            color: {
              value: [snapshotStyle.getPropertyValue('color'), '#050505'],
              duration: 100,
              easing: 'easeOutExpo'
            },
            backgroundColor: {
              value: [snapshotStyle.getPropertyValue('background-color'), '#dbdbdb'],
              duration: 100,
              easing: 'easeOutExpo'
            },
          }).add({
            targets: menuitemElem,
            duration: 100,
            easing: 'easeOutExpo',
            width: 'max-content',
            padding: snapshotStyle.getPropertyValue('padding'),
            complete: () => {
              menuitemElem.className = 'menu-item ' + cls;
              resolve(0)
            }
          })

          timeline.restart()
        }
      }
    })
  }
}