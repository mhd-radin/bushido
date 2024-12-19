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
      thumbImg =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC";
      bushido.get("base64", data.imgUrl).then(function (snapshot) {
        var imgData = snapshot.data();
        thumbImg = imgData.url;
        document.getElementById(data.id).querySelector("img").src = thumbImg;
      });
      addPost();
    } else {
      addPost();
    }
  });
});
