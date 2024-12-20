if (document.querySelector(".menubox")) {
  var menubox = document.querySelector(".menubox");
  menubox.querySelectorAll(".menu-item").forEach(function (menuItem, index) {
    if (menuItem.dataset.url) {
      var url = menuItem.dataset.url;
      menuItem.onclick = function () {
        menu
          .close(document.querySelector(".menu-item.active"))
          .then(function () {
            if (spinner) {
              spinner.showPreloader();
            }
            window.location.href = url;
          });
      };
    }
  });
}

const menu = {
  close(menuitemElem = document.body, cls = "preview") {
    return new Promise((resolve, reject) => {
      resolve()
    });
  },
};
