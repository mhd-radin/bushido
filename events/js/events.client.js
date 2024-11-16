app.validUser().catch(() => {
  app.redirectWithPreloader("../register");
});

function onpageloadin() {
  const targetElements = document.querySelectorAll(".image-card"); // Element to observe
  targetElements.forEach(function(targetElement) {
    observer.observe(targetElement);
  });

  document.querySelectorAll(".note-card").forEach(function(targetElement) {
    microObserver.observe(targetElement);
  });
}

var rotate = 0;

document.querySelectorAll(".note-card").forEach(function(elem) {
  function handleMoves(e) {
    let X = 0,
      Y = 0;
    if (e.touches || e.changedTouches) {
      X = e.changedTouches[0].clientX;
      Y = e.changedTouches[0].clientY;
    } else {
      X = e.clientX;
      Y = e.clientY;
    }
    var y = Y - elem.offsetTop;

    elem.querySelector(".note-ripple").style.display = "block";
    elem.querySelector(".note-ripple").style.left =
      X - elem.offsetLeft - elem.offsetWidth / 1 + "px";
    elem.querySelector(".note-ripple").style.top = y - elem.clientHeight + "px";
    rotate = Math.cos(X / 100) * Math.sin(Y / 100);

    elem.querySelector(".note-ripple").style.transform =
      "translate(40px, 40px) rotate(" + rotate * 100 + "deg)";
  }
  elem.addEventListener("mousemove", handleMoves);
  elem.addEventListener("touchmove", handleMoves);

  function off() {
    elem.querySelector(".note-ripple").style.display = "none";
  }
  elem.addEventListener("mouseleave", off);
  elem.addEventListener("touchend", off);
});


function useImageCard(title, des, source_url, date) {
  return new TagString(`
<div class="image-card">
  <img src="../assets/bg/members.jpg" alt="" class="img-content" />
  <div class="image-card-body">
    <div class="image-card-texts">
      <div class="image-card-title">Bushido members photo</div>
      <div class="image-card-subtext">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Saepe exercitationem, repellat neque eligendi et deserunt
        quisquam aliquam nesciunt illum ipsa rerum a nemo debitis.
        Eum saepe ex modi omnis enim.
      </div>
    </div>
    <div class="image-card-footer">
      <div class="card-button">
        <i class="eva eva-heart-outline"></i>
        <div class="card-btn-text">Like</div>
      </div>
      <div class="card-button">
        <i class="eva eva-message-square-outline"></i>
        <div class="card-btn-text">Replay</div>
      </div>
      <div class="card-button">
        <i class="eva eva-share-outline"></i>
        <div class="card-btn-text">Share</div>
      </div>
    </div>
  </div>
</div>
`)
}