const commenter = {
  commentBoxElem: q('.comment-modal'),
  commentBoxBodyElem: q('.comment-body'),
  getComments(postID, clearPrev = true) {
    if (clearPrev) {
      this.clearComments();
    }
    bushido.get("comments", postID).then(function(snapshot) {
      if (snapshot.exists()) {
        let data = snapshot.data();
        let comments = data.comments;

        if (comments.length == 0) {
          if (commenter.clearComments) commenter.clearComments(true);
        } else {
          if (commenter.clearComments) commenter.clearComments();
        }

        comments.forEach(function(comment, i) {
          let elem = userboxUI.create(comment.username, comment.commentMsg, (comment.avatar || app.avatarUrl(
            comment.username)), '').parseElement()[0];
          commenter.commentBoxBodyElem.appendChild(elem);
        })
      } else {
        if (commenter.clearComments) commenter.clearComments(true);
      }
    })
  },
  postComment(commentData) {
    bushido.set('comments/' + commentData.postId, function(sdk) {
      
      return {
        comments: sdk.arrayUnion(commentData)
      }
    }, {
      merge: true
    }).then(function() {
      commenter.getComments(commentData.postId)
    })
  },
  clearComments(useInfo) {
    this.commentBoxBodyElem.innerHTML = (useInfo ? `<div class="user-box">
              <div class="user-row">
                <div class="user-icon">
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0idy1bNTBweF0gaC1bNTBweF0gZmlsbC1bIzhlOGU4ZV0iIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoKICA8IS0tISBGb250IEF3ZXNvbWUgRnJlZSA2LjQuMiBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZSAoQ29tbWVyY2lhbCBMaWNlbnNlKSBDb3B5cmlnaHQgMjAyMyBGb250aWNvbnMsIEluYy4gLS0+CiAgPHBhdGggZD0iTTAgMjU2YTI1NiAyNTYgMCAxIDEgNTEyIDBBMjU2IDI1NiAwIDEgMSAwIDI1NnptMjU2LTk2YTk2IDk2IDAgMSAxIDAgMTkyIDk2IDk2IDAgMSAxIDAtMTkyem0wIDIyNGExMjggMTI4IDAgMSAwIDAtMjU2IDEyOCAxMjggMCAxIDAgMCAyNTZ6bTAtOTZhMzIgMzIgMCAxIDAgMC02NCAzMiAzMiAwIDEgMCAwIDY0eiI+PC9wYXRoPgoKPC9zdmc+"
                    alt="" class="user-image">
                </div>
                <div class="user-body">
                  <div class="user-name">Looking for comments</div>
                  <div class="user-subtext">We're working on Looking for comments for you. If this takes too long, please
                    check your internet connection and try again.</div>
                  <div class="user-right">
                    <i class="eva eva-reload-outline"></i>
                  </div>
                </div>
              </div>
            </div>` : '');
  },
  Comment: class CommentSchema {
    constructor(postData, userData, commentMsg) {
      this.username = userData.fullname;
      this.email = userData.email;
      this.phone = userData.phone;
      this.date = new Date();
      this.commentMsg = commentMsg;
      this.likes = 0;
      this.postId = postData.id;
      this.postType = postData.type;
      this.avatar = (userData.avatar || app.avatarUrl(postData.fullname))
    }

    export () {
      var obj = {};

      var self = this;
      Object.keys(this).forEach(function(key) {
        obj[key] = self[key];
      });

      return obj;
    }
  }
}