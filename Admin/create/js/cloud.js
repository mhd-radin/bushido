function useCloud(file, onupload = function() {}, preset = 'thumbs', cloud = config.cloud.cloud_name) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    if (!cloud || typeof cloud == 'undefined') {
      cloud = config.cloud.cloud_name
    }

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloud}/${getFileType(file)}/upload`,
      true
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onupload(event, progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.send(formData)
  });
}

function getFileType(file) {
  if (!file || !file.type) return null;
  return file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
}

function uploadFile(thumbnailFile, then, cloudPreset, cloudName) {
  modal.alert(("Uploading " + getFileType(thumbnailFile) + "..."), (divId, buttonId) => {
    var file = thumbnailFile;
    setTimeout(function() {
      id(buttonId).style.display = "none";
    }, 50);
    useCloud(file, () => {}, cloudPreset, cloudName)
      .then(function(res) {
        if (typeof res == 'string') {
          res = JSON.parse(res)
        }

        id(buttonId).click();
        if (typeof then == 'function') then(res);
      })
      .catch(function(err) {
        id(buttonId).click();
        modal.alert(
          "Error Uploading File",
          "faild to upload file. chech your internet connection and retry. <br /><br/> ERROR: " +
          err
        );
      });

    return '<center><img src="../../assets/spinner/ring-resize.svg" class="svg-mini-loader loader-x2"></img></center>';
  }, '', function(divId, buttonId) {
    id(buttonId).style.display = "none";
  });
}