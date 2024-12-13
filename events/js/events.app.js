bushido.getCollection("posts").then(function (snapshot) {
  var arr = bushido.toData(snapshot);
  useEmptyInfoScreen();
  arr.forEach(function (dt, index) {
    var data = dt.data();
    var tagstring = useImageCard(
      data.id,
      data.title,
      data.des,
      data.imgUrl,
      false
    );
    addPostToBody(tagstring);
  });
});
