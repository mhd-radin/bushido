const createSlide = id("createSlide");

const createPostTypeOpt = id("createPostType");
const createImgOpt = id("createImgOpt");
const createSubmit = id("createSubmit");
const thumbImagePreview = id("thumbImagePreview");

const createThumbnailSection = id(
  "createThumbnailSection"
);
const createSrcSection = id("createSrcSection");
const createSrcPreview = id("createSrcPreview");

function updatePostInputUI() {
  let value = createPostTypeOpt.value;
  updateRequireInputs(false)

  if (value && value == "postThumb") {
    id("createSrcSection").style.display = "none";
    id("createThumbnailSection").style.display = "block";
    updateCreateInputUI();
  } else if (value == "story") {
    id("createSrcSection").style.display = "block";
    id("createThumbnailSection").style.display = "none";
    disableThumbnailInputs()
    updateRequireInputs(true);
  } else if (value == "photo" || value == 'notice') {
    id("createSrcSection").style.display = "none";
    id("createThumbnailSection").style.display = "block";
    updateCreateInputUI();
  } else if (value == "video") {
    id("createSrcSection").style.display = "block";
    id("createThumbnailSection").style.display = "block";
    disableThumbnailInputs();
    updateRequireInputs(true)
  } else {
    id("createSrcSection").style.display = "none";
    id("createThumbnailSection").style.display = "none";
  }
}

function updateCreateInputUI() {
  let value = createImgOpt.value;

  if (value && value == "upload") {
    id("createImgUrl_seg").style.display = "none";
    id("createImgFile_seg").style.display = "block";

    id("createImgUrl").required = false;
    id("createImgFile").required = true;
  } else {
    id("createImgUrl_seg").style.display = "block";
    id("createImgFile_seg").style.display = "none";

    id("createImgUrl").required = true;
    id("createImgFile").required = false;
  }
}

function disableThumbnailInputs() {
  id("createImgUrl").required = false;
  id("createImgFile").required = false;
}

function updateRequireInputs(sourcesFileInput) {
  id("createImageSrc").required = sourcesFileInput;
}

createPostTypeOpt.onchange = updatePostInputUI;
createImgOpt.onchange = updateCreateInputUI;
updatePostInputUI();


createSubmit.addEventListener("submit", function(e) {
  e.preventDefault();

  var title = id("createTitle");
  var des = id("createDes");
  var type = id("createPostType").value;
  var imgType = id("createImgOpt").value;
  var thumbUrl = id("createImgUrl");
  var thumbFile = id("createImgFile");

  // sorting or setting types as postCollection for server
  let postCollection = PostData.getColl(type);
  

  function createPostOnServer(postData) {
    modal.alert("Creating new post", (divId, buttonId) => {
      setTimeout(function() {
        id(buttonId).style.display = "none";
      }, 50);

      bushido
        .set(postCollection + "/" + postData.id, postData.export())
        .then(function() {
          id(buttonId).click();
          modal.alert("New post created successfully", "Post created successfully. click continue to go back").then(function () {
            closeAllSlides();
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

  function uploadSourcesFromInp() {
    let sourceFile = id("createImageSrc").files[0];
    uploadFile(sourceFile, function(res) {
      postData.extras.url = res.url;
      postData.extras.type = sourceFile.type;
      postData.extras.author = 'Bushido';
      postData.extras.isAdmin = true;
      postData.extras.isLive = false;
      createPostOnServer(postData);
    })
  }

  let postData = new PostData(
    title.value,
    des.value,
    type,
    "url",
    thumbUrl.value, {}
  );

  // post
  if (type == "postThumb" || type == "photo" || type == "notice") {
    if (imgType == "upload") {
      uploadFile(thumbFile.files[0], function(res) {
        postData.imgUrl = res.url;
        createPostOnServer(postData);
      })
    } else {
      createPostOnServer(postData);
    }
  }
  else if (type == "video" || type == "story") {
    // if thumbnail file found on input
    if (thumbFile.files.length > 0 && imgType == "upload") {
      uploadFile(thumbFile.files[0], function(res) {
        postData.imgUrl = res.url;
        uploadSourcesFromInp();
      })
    } 
    // if thumbnail not found on input
    else {
      uploadSourcesFromInp()
    }
  }
});

function updateThumbImagePreview(e, file) {
  if (file) {
    var src = window.URL.createObjectURL(file);
    thumbImagePreview.src = src
  } else {
    thumbImagePreview.src = id("createImgUrl").value;
  }
}


function updateSourcesPreview(e, file) {
  if (file) {
    var src = window.URL.createObjectURL(file);
    createSrcPreview.type = file.type;
    createSrcPreview.src = src;
  }
}

id("createImgUrl").onchange = updateThumbImagePreview;
id("createImgUrl").onkeyup = updateThumbImagePreview;
id("createImgFile").onchange = function(e) {
  updateThumbImagePreview(e, id("createImgFile").files[0])
}

id("createImageSrc").onchange = function(e) {
  updateSourcesPreview(e, id("createImageSrc").files[0])
}