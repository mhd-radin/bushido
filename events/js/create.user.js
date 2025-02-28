const addPostBtn = document.getElementById('addPost');

function createPostOnServer(postData, postCollection) {
  modal.alert("Creating new post", (divId, buttonId) => {
    setTimeout(function() {
      id(buttonId).style.display = "none";
    }, 50);

    bushido
      .set(postCollection + "/" + postData.id, postData.export())
      .then(function() {
        id(buttonId).click();
        modal.alert("New post created successfully", "Post created successfully. click continue to go back").then(
          function() {
            location.reload()
          })
      })
      .catch(function(err) {
        id(buttonId).click();
        modal.alert(
          "Error Creating Post",
          "faild creating post. chech your internet connection and retry. <br /><br/> ERROR: " +
          err
        );
      });

    return `Wait few seconds to create post.`
  });
}


addPostBtn.onclick = function() {
  modal.useDropdown(addPostBtn, [{
    label: 'Add Story',
    icon: 'video-outline',
    clickAction: function() {
      modal.prompt('Add story title', '', 'Story title here').then(function(title) {
        modal.prompt('Add story description', '', 'Story description here', true).then(function(des) {
          modal.prompt('Add story video file', '', 'Story title here', false, 'file').then(function(
            files) {
            let file = files[0];


            console.log(file)
            if (title && des && file) {
              app.validUser().then(function(user) {
                let postData = new PostData(title, des, 'story', 'url', "", {})
                uploadFile(file, function(res) {
                  postData.extras.url = res.url;
                  postData.extras.type = file.type;
                  postData.extras.author = user.fullname;
                  postData.extras.isAdmin = false;
                  postData.extras.isLive = false;
                  postData.extras.authorID = user.id;

                  createPostOnServer(postData, PostData.getColl('story'));
                })
              })
            }
          })
        })
      })
    },
    id: 'addPostDdown'
  }], ['0'])
}