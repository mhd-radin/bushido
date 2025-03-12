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

async function deleteVideoFromCloudinary(publicId, fileType =  'video') {
  const cloudName = config.cloud.cloud_name; // Replace with your Cloudinary cloud name
  const apiKey = config.cloud.api_key; // Replace with your Cloudinary API key
  const apiSecret = config.cloud.api_secret; // Replace with your Cloudinary API secret

  // Generate a timestamp
  const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds

  // Generate the signature
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = CryptoJS.SHA1(paramsToSign).toString(CryptoJS.enc.Hex);

  // API endpoint
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/destroy`;

  // Form data for the request
  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.result === 'ok') {
      console.log('Video deleted successfully:', publicId);
    } else {
      console.log('Failed to delete video:', result);
    }
  } catch (error) {
    console.log('Error deleting video:', error);
  }
}


function uploadFile(thumbnailFile, then, cloudPreset, cloudName) {
  modal.alert(("Uploading " + getFileType(thumbnailFile) + "..."), (divId, buttonId) => {
    var file = thumbnailFile;
    setTimeout(function() {
      id(buttonId).style.display = "none";
    }, 50);
    let progress = 0
    useCloud(file, (e, prg) => {
      progress = prg;
      if (id("modalPrg")){
        id("modalPrg").innerHTML = prg+"% Uploaded"
      }
    }, cloudPreset, cloudName)
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

    return '<center><img src="../../assets/spinner/ring-resize.svg" class="svg-mini-loader loader-x2"></img><p id="modalPrg">0% Uploaded</p></center>';
  }, '', function(divId, buttonId) {
    id(buttonId).style.display = "none";
  });
}