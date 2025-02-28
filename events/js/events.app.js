bushido.getCollection("posts").then(function(snapshot) {
  var arr = bushido.toData(snapshot);
  useEmptyInfoScreen();
  arr.forEach(function(dt, index) {
    var data = dt.data();
    var thumbImg = data.imgUrl;

    function addPost() {
      var tagstring = useImageCard(
        data.id,
        data.title,
        data.des,
        thumbImg,
        false
      ).parseElement()[0];
      addPostToBody(tagstring);

      var elem = tagstring;
      elem.onclick = function() {
        searchOnURL(data.id);
      }
    }

    if (data.imageType == "file") {
      thumbImg =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC";
      bushido.get("base64", data.imgUrl).then(function(snapshot) {
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

function cloudinaryTransform(url, transformations = {}) {
  const urlParts = url.split("/upload/");
  if (urlParts.length !== 2) return console.error("Invalid Cloudinary URL");

  const transformString = Object.entries(transformations)
    .map(([key, value]) => `${key}_${value}`)
    .join(",");

  return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`;
}




/// story 
bushido.getCollection("stories").then(function(snapshot) {
  var arr = bushido.toData(snapshot);
  clearLinearContents('.stories-box');
  arr.forEach(function(dt, index) {
    var data = dt.data();
    var thumbImg = ((data.imgUrl == '' || !data.imgUrl) ? cloudinaryTransform(data.extras.url, {
      so: 2,
      dpr: 'auto',
      c: "fill",
      f: "jpg"
    }) : data.imgUrl);

    function add() {
      var tagstring = (CardStructure.story.create(
        data.id,
        thumbImg,
        data.extras.author,
        data.des,
        (data.avatar || app.avatarUrl(data.extras.author)),
        dayjs(data.date).fromNow()).parseElement()[0]);
      appendToLinearContents('.stories-box', tagstring)
      return tagstring;
    }

    var elem = add();
    elem.onclick = function() {
      searchOnURL(data.id);
    }
  });
});


/// video 
bushido.getCollection("videos").then(function(snapshot) {
  var arr = bushido.toData(snapshot);
  clearLinearContents('.videos-box');
  arr.forEach(function(dt, index) {
    var data = dt.data();
    var thumbImg = ((data.imgUrl == '' || !data.imgUrl) ? cloudinaryTransform(data.extras.url, {
      so: 2,
      dpr: 'auto',
      c: "fill",
      f: "jpg"
    }) : data.imgUrl);

    function add() {
      var tagstring = (CardStructure.video.create(
        data.id, thumbImg, data.title, data.des).parseElement()[0]);
      appendToLinearContents('.videos-box', tagstring);
      return tagstring;
    }

    var elem = add();
    elem.onclick = function() {
      searchOnURL(data.id);
    }
  });
});




/// poster
bushido.getCollection("photos").then(function(snapshot) {
  var arr = bushido.toData(snapshot);
  clearLinearContents('.posters-box');
  arr.forEach(function(dt, index) {
    var data = dt.data();
    var thumbImg = data.imgUrl;

    function add() {
      var tagstring = CardStructure.createPoster(data.id, thumbImg);
      appendToLinearContents('.posters-box', tagstring.parseElement()[0])
    }

    add();
  });
});