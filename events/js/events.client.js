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
  // elem.addEventListener("mousemove", handleMoves);
  // elem.addEventListener("touchmove", handleMoves);

  // function off() {
  //   elem.querySelector(".note-ripple").style.display = "none";
  // }
  // elem.addEventListener("mouseleave", off);
  // elem.addEventListener("touchend", off);
});

function useImageCard(id, title, des, source_url, isVideo) {
  return new TagString(`
<div class="image-card" id="${id}">
  <div class="img-container">
              <img src="${source_url}" alt="" class="img-content" />
              ${isVideo ? `<i class="play-icon eva eva-arrow-right"></i>` : ""}
            </div>
            <div class="image-card-body">
              <div class="image-card-texts">
                <div class="image-card-title">${title}</div>
                <div class="image-card-subtext">
                  ${des}
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
`);
}

function useEmptyInfoScreen() {
  var code = `<div class="post-info">
            <img src="../assets/svg/undraw_no_data_re_kwbl_bl.svg" alt="" srcset="">
            <p>Could not find any posts or events..!</p>
          </div>`;
  document.getElementById("posts").innerHTML = "";
}

function addPostToBody(tag) {
  document.getElementById("posts").appendChild(tag);
}



function clearLinearContents(linearBoxElemQuery, defaultChildHtml = '', styleDisplay = 'none') {
  document.querySelector(linearBoxElemQuery + ' .linear-contents').innerHTML = defaultChildHtml;
  document.querySelector(linearBoxElemQuery).style.display = styleDisplay;
}

function appendToLinearContents(linearBoxElemQuery, child, styleDisplay = 'block') {
  document.querySelector(linearBoxElemQuery).style.display = styleDisplay;
  document.querySelector(linearBoxElemQuery + ' .linear-contents').appendChild(child);
}



function addInfoToPost() {
  // Tab to edit
}


function postCommentWithCurrentUser(postData) {
  let inp = id('commentInp');
  if (inp.value) {
    app.validUser().then(function(userData) {
      let comment = new commenter.Comment(postData, userData, inp.value);
      commenter.postComment(comment.export());
    })
  }
}

function updatePostViewer(postData, type, show = false) {
  q('.postbody .img-content').src = (postData.extras.url || postData.imgUrl);
  q('.postbody .img-content').poster = postData.imgUrl;
  q('.postbody .image-card-title').innerHTML = postData.title;
  q('.postbody .image-card-subtext').innerHTML = postData.des;
  //q('.postbody .img-content').type = (postData.extras.type || 'image/jpeg');

  if (show) {
    q('.post-session').style.display = 'block';
    q('.main-session').style.display = 'none';

    commenter.getComments(postData.id);
    id('commentBtn').onclick = function() {
      postCommentWithCurrentUser(postData);
    }
  } else {
    q('.post-session').style.display = 'none';
    q('.main-session').style.display = 'block';
    id('commentBtn').onclick = function() {}
  }
}

id('closePostViewer').onclick = function() {
  q('.post-session').style.display = 'none';
  q('.main-session').style.display = 'block';
}


id('postPlayer').ontoggle = function(i) {
  alert(i)
}