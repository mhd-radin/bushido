bushido.getCollection("posts").then(function (snapshot) {
  var arr = bushido.toData(snapshot);
  useEmptyInfoScreen();
  arr.forEach(function (dt, index) {
    var data = dt.data();
    var thumbImg = data.imgUrl;

    function addPost() {
      var tagstring = useImageCard(
        data.id,
        data.title,
        data.des,
        thumbImg,
        false
      );
      addPostToBody(tagstring);
    }

    if (data.imageType == "file") {
        
      bushido.get("base64", data.imgUrl).then(function (snapshot) {
        var data = snapshot.data();
        thumbImg = data.url;
        addPost();
      });
    } else {
      addPost();
    }
  });
});
