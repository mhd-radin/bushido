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
        
        comments.forEach(function (comment, i) {
          let elem = userboxUI.create(comment.username, comment.commentMsg, (comment.avatar || app.avatarUrl(comment.username)), '').parseElement()[0];
          commenter.commentBoxBodyElem.appendChild(elem);
        })
      }
    })
  },
  postComment(commentData) {
    bushido.set('comments/' + commentData.postId, function(sdk) {
      console.log(sdk.arrayUnion)
      return {
        comments: sdk.arrayUnion(commentData)
      }
    }, {
      merge: true
    })
  },
  clearComments() {
    this.commentBoxBodyElem.innerHTML = '';
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
      this.avatar = app.avatarUrl(postData.fullname)
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