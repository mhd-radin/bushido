function createManagePost(postData, tags) {
  console.log(postData)
  var thumbImg = ((postData.imgUrl == '' || !postData.imgUrl) ? cloudinaryTransform(postData.extras.url, {
    so: 2,
    dpr: 'auto',
    c: "fill",
    f: "jpg"
  }) : postData.imgUrl);


  return (new TagString(`<div class="manage-post">
              <img src="${thumbImg}" alt="">
              <div class="manage-middle bold-font">${postData.title} <br/> ${postData.watched} Views • ${postData.likes} Likes • ${postData.shares} Shares
                ${(Array.isArray(tags) ? `<div class="post-tags">
                    ${(tags.map((arr)=> `<div class="post-tag ${arr[2]}">
                      <i class="eva eva-${arr[0]}"></i>
                      <span>${arr[1]}</span>
                    </div>`)).join('')}
                  </div>` : '')}
              </div>
              <div class="manage-right">
                <i class="eva eva-trash-2-outline delete"></i>
              </div>
            </div>`))
}

dayjs.extend(window.dayjs_plugin_relativeTime);


function handlePosts(snapshot) {
  var posts = bushido.toData(snapshot);

  q('.manage-list').appendChild(document.createElement('hr'))
  posts.forEach((postDataFB) => {
    if (postDataFB.exists()) {
      let postData = postDataFB.data();
      let tags = [['grid', PostData.getColl(postData.type), 'green-tag'], ['calendar', dayjs(postData.date)
      .fromNow(), '']];

      if (postData.type == 'video' && postData.extras.url && (postData.extras.url.includes('.m3u8') || postData
          .extras.url.includes('.m3u') || postData
          .extras.url.includes('#live'))) {
        tags.push(['radio-button-on', 'Live', 'red-tag'])
      }

      let elem = createManagePost(postData, tags).parseElement()[0];
      q('.manage-list').appendChild(elem);
      elem.querySelector('.delete.eva').onclick = function() {
        modal.confirm('Delete Post', 'Are you sure to delete post permanently').then(function(promiss) {
          if (promiss) {
            
            let sources = [];
            let fileTypes = []
            if (postData.extras.url && postData.extras.url.includes('res.cloudinary.com')){
              sources.push(postData.extras.url)
              fileTypes.push(getFileType(postData.extras))
            }
            
            if (postData.imgUrl.includes('res.cloudinary.com')){
              sources.push(postData.imgUrl)
              sources.push(postData.imgUrl)
              fileTypes.push('image', 'video')
            }
            console.log(sources)
            PostData.deletePostFromServer(postData.id, sources, postData.type,
              fileTypes).then(function() {
              alert('Deleted');
              refreshManagePosts()
            })
          }
        })
      }
    }
  })
}

function refreshManagePosts() {
  q('.manage-list').innerHTML = '';
  bushido.getCollection('posts').then(handlePosts);
  bushido.getCollection('stories').then(handlePosts);
  bushido.getCollection('videos').then(handlePosts);
  bushido.getCollection('photos').then(handlePosts);
  bushido.getCollection('notices').then(handlePosts);
}