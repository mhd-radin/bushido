const createSlide = document.getElementById("createSlide");
const createSlideInputElems = [
  document.getElementById("createTitle"),
  document.getElementById("createDes"),
  document.getElementById("createImgUrl"),
  document.getElementById("createImgFile"),
  document.getElementById("createSubmit"),
];

const createPostTypeOpt = document.getElementById("createPostType");
const createImgOpt = document.getElementById("createImgOpt");

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
