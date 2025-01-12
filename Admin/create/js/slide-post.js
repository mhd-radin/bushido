const createSlide = document.getElementById("createSlide");

const createPostTypeOpt = document.getElementById("createPostType");
const createImgOpt = document.getElementById("createImgOpt");
const createSubmit = document.getElementById("createSubmit");
const thumbImagePreview = document.getElementById("thumbImagePreview");

const createThumbnailSection = document.getElementById(
  "createThumbnailSection"
);
const createSrcSection = document.getElementById("createSrcSection");

function updatePostInputUI() {
  let value = createPostTypeOpt.value;

  if (value && value == "postThumb") {
    document.getElementById("createSrcSection").style.display = "none";
    document.getElementById("createThumbnailSection").style.display = "block";
    updateCreateInputUI();
  } else if (value == "event") {
    document.getElementById("createSrcSection").style.display = "block";
    document.getElementById("createThumbnailSection").style.display = "block";
    updateCreateInputUI();
  } else {
    document.getElementById("createSrcSection").style.display = "none";
    document.getElementById("createThumbnailSection").style.display = "none";
  }
}

function updateCreateInputUI() {
  let value = createImgOpt.value;

  if (value && value == "upload") {
    document.getElementById("createImgUrl_seg").style.display = "none";
    document.getElementById("createImgFile_seg").style.display = "block";

    document.getElementById("createImgUrl").required = false;
    document.getElementById("createImgFile").required = true;
  } else {
    document.getElementById("createImgUrl_seg").style.display = "block";
    document.getElementById("createImgFile_seg").style.display = "none";

    document.getElementById("createImgUrl").required = true;
    document.getElementById("createImgFile").required = false;
  }
}

createPostTypeOpt.onchange = updatePostInputUI;
createImgOpt.onchange = updateCreateInputUI;
updatePostInputUI();

createSubmit.addEventListener("submit", function (e) {
  e.preventDefault();

  var title = document.getElementById("createTitle");
  var des = document.getElementById("createDes");
  var type = document.getElementById("createPostType").value;
  var imgType = document.getElementById("createImgOpt").value;
  var thumbUrl = document.getElementById("createImgUrl");
  var thumbFile = document.getElementById("createImgFile");

  function createPostOnServer(postData) {
    modal.alert("Creating new post", (divId, buttonId) => {
      setTimeout(function () {
        document.getElementById(buttonId).style.display = "none";
      }, 50);

      bushido
        .set("posts/" + postData.id, postData.export())
        .then(function () {
          document.getElementById(buttonId).click();
          modal.alert("New post created successfully", "");
        })
        .catch(function (err) {
          document.getElementById(buttonId).click();
          modal.alert(
            "Error Creating Post",
            "faild creating post. chech your internet connection and retry. <br /><br/> ERROR: " +
              err
          );
        });
    });
  }

  if (type == "postThumb" || type == "event") {
    if (imgType == "upload") {
      modal.alert("Uploading Thumbnail...", (divId, buttonId) => {
        setTimeout(function () {
          document.getElementById(buttonId).style.display = "none";
        }, 50);

        var file = thumbFile.files[0];
        useCloud(file)
          .then(function (res) {
            if (typeof res == 'string'){
              res = JSON.parse(res)
            }

            var postData = new PostData(
              title.value,
              des.value,
              type,
              "url",
              res.url,
              {}
            );
            createPostOnServer(postData);
          })
          .catch(function (err) {
            document.getElementById(buttonId).click();
            modal.alert(
              "Error Uploading File",
              "faild to upload file. chech your internet connection and retry. <br /><br/> ERROR: " +
                err
            );
          });

        return '<center><img src="../../assets/spinner/ring-resize.svg" class="svg-mini-loader loader-x2"></img></center>';
      });
    } else {
      var postData = new PostData(
        title.value,
        des.value,
        type,
        "url",
        thumbUrl.value,
        {}
      );
      createPostOnServer(postData);
    }
  } else {
    var postData = new PostData(title.value, des.value, type, "url", false, {});
    createPostOnServer(postData);
  }
});

function updateThumbImagePreview() {
  thumbImagePreview.src = document.getElementById("createImgUrl").value;
}

document.getElementById("createImgUrl").onchange = updateThumbImagePreview;
document.getElementById("createImgUrl").onkeyup = updateThumbImagePreview;
