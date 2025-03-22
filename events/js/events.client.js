app.validUser().catch(() => {
  app.redirectWithPreloader("../register");
});

dayjs.extend(window.dayjs_plugin_relativeTime);

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
              <!--div class="image-card-footer">
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
              </div-->
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
      inp.value = "";
    })
  }
}


function updateLikeBtn(isLiked, likeCount = '') {
  if (isLiked) {
    q('#likeBtn .eva').classList.replace('eva-heart-outline', 'eva-heart')
    q('#likeBtn .card-btn-text').innerHTML = likeCount + ' Likes';
  } else {
    q('#likeBtn .eva').classList.replace('eva-heart', 'eva-heart-outline')
    q('#likeBtn .card-btn-text').innerHTML = ' Like';
  }
}

function searchOnURL(postId) {
  let idParams = PostData.extractParams(postId);
  window.location.search = '?tp=' + idParams[0] + '&pp=' + idParams[1] + '&sp=' + idParams[2]
}

function updatePostViewer(postData, show = false) {
  q('.postbody .img-content').src = (postData.extras.url || postData.imgUrl);
  q('.postbody .img-content').poster = (postData.imgUrl || postData.extras.url);
  q('.postbody .image-card-title').innerHTML = postData.title;
  q('.postbody .image-card-subtext').innerHTML = postData.des +
    `<br><div>${dayjs(postData.date).fromNow()}</div>`;


  let fileMediaType = getFileType(postData.extras)
  
  
  if (fileMediaType === 'video') {
    id('postPlayer').controls = true;
  } else {
    // q('.img-content').tagName = 'video';
    id('postPlayer').controls = false;
  }

  //q('.postbody .img-content').type = (postData.extras.type || 'image/jpeg');

  if (show) {
    document.body.classList.toggle('showPostSession', true);
    commenter.clearComments(true)

    commenter.getComments(postData.id);
    id('commentBtn').onclick = function() {
      postCommentWithCurrentUser(postData);
    }

    let tags = []


    if (postData.extras.url && (postData.extras.url.includes('.m3u8') || postData.extras.url.includes('.m3u') ||
        postData
        .extras.url.includes('#live'))) {
      tags.push(['radio-button-on', 'Live', 'red-tag'])
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(postData.extras.url);
        hls.attachMedia(q('.postbody .img-content'));
      }
    }

    const TAGSOUTPUT = tags.map((arr) => `<div class="post-tag ${arr[2]}">
                      <i class="eva eva-${arr[0]}"></i>
                      <span>${arr[1]}</span>
                    </div>`).join('')

    id('postTagView').innerHTML = TAGSOUTPUT;


    let collection = PostData.getColl(postData.type);

    app.validUser().then(function(data) {
      updatePostOpt(data, postData.id, {
        collType: collection,
        togglable: false,
        name: 'watched'
      })

      let authorID = postData.extras.authorID;
      if (authorID && data.id === authorID) {
        id('deleteBtn').style.display = 'flex'
      } else {
        id('deleteBtn').style.display = 'none'
      }

      function checkLikeStatus() {
        bushido.get('likes', postData.id).then(function(snapshot) {
          if (snapshot.exists()) {
            let arr = snapshot.data().contents;
            
            if (arr && arr.length > 0 && arr.indexOf(data.id) != -1) {
              q('#likeBtn .eva').className = 'eva eva-heart-outline'
              updateLikeBtn(true, arr.length)
            } else {
              q('#likeBtn .eva').className = 'eva eva-heart'
              updateLikeBtn(false)
            }
          }
        })
      }

      checkLikeStatus()


      id('likeBtn').onclick = function() {
        q('#likeBtn .eva').className = 'eva eva-clock-outline'
        updatePostOpt(data, postData.id, {
          collType: collection,
          togglable: true,
          name: 'likes'
        }).then(function(e, e1) {
          checkLikeStatus()
        })
      }

      id('deleteBtn').onclick = function() {
        if (authorID && data.id === authorID && confirm('Are you sure to delete the story permanently')) {
          PostData.deletePostFromServer(postData.id, [postData.extras.url], postData.type, ['video']).then(function () {
            location.search = "";
          })
        }
      }

      id('shareBtn').onclick = function(l) {
        if ('share' in navigator) {
          navigator.share({
            title: postData.title + ' • Bushido',
            text: postData.title + ' • Bushido',
            url: window.location.href,
          }).then(function() {
            updatePostOpt(data, postData.id, {
              collType: collection,
              togglable: false,
              name: 'shares'
            })
          })
        }
      }
    })
  } else {
    document.body.classList.toggle('showPostSession', false);
    id('commentBtn').onclick = function() {}
    id('likeBtn').onclick = function() {}
    id('postTagView').innerHTML = ''
  }
}

id('closePostViewer').onclick = function() {
  window.location.search = ''
}

function updateFromURL() {
  var search = window.location.search;
  let params = new URLSearchParams(search);
  let [tp, pp, sp] = [params.get('tp'), params.get('pp'), params.get('sp')];

  if (search && tp && pp && sp) {
    let id = 'POST_' + tp + '_' + pp + '__' + sp;
    document.body.classList.toggle('showPostSession', true);
    bushido.get(PostData.getColl(tp), id).then(function(snapshot) {
      let postData = snapshot.data()
      if (snapshot.exists() && postData) {
        updatePostViewer(postData, 'block')
      } else {
        modal.alert("Post Unavailable (404 Error)",
          "Unfortunately, the post you're looking for has been deleted, moved, or never existed.").then(
          function() {
            window.location.search = ""
          })
      }
    })
  } else {
    document.body.classList.toggle('showPostSession', false);
  }
}

window.addEventListener('popstate', updateFromURL);
updateFromURL()