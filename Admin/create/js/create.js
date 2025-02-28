function handleItemClick(slidesList = 'none', body = 'block') {
  if (window.innerWidth < 650) {
    document.querySelector(".slides-list").style.display = "none";
    document.querySelector(".body").style.display = "block";
    document.scrollingElement.scrollTop = 0;
  }
}

document.querySelectorAll(".option").forEach(function(userItemElem) {
  userItemElem.onclick = function() {
    document.querySelectorAll(".user-box-active").forEach(function(el) {
      if (el.classList) el.classList.remove("user-box-active");
    });
    userItemElem.classList.add("user-box-active");
    handleItemClick();
    document.querySelectorAll(".slide").forEach(function(el) {
      el.style.display = "none";
      if (el.classList.contains(userItemElem.id + "-slide")) {
        el.style.display = "block";
      }
    });
  };
});

function closeAllSlides() {
  document.querySelectorAll(".user-box-active").forEach(function(el) {
    if (el.classList) el.classList.remove("user-box-active");
  });

  document.querySelectorAll(".slide").forEach(function(el) {
    el.style.display = "none";
  })
  
  handleItemClick('flex', 'none');
}