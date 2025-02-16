function updatePostOpt(userData, postId, opt = {
  collType: 'posts',
  togglable: true,
  name: 'likes' // updates post data likes && collection name
}) {
  return new Promise(function(resolve, reject) {
    let optName = opt.name;
    bushido.useQuery(optName, [['contents', 'array-contains', userData.id]]).then(function(snapshot) {
      let fisrtItem = bushido.toData(snapshot)[0];
      
      if (fisrtItem && fisrtItem.exists()) {
        if (opt.togglable) {
          decreasePostOpt(postId, userData.id, opt.name, opt.collType).then(resolve).catch(reject)
        }
      } else {
        addPostOpt(postId, userData.id, opt.name, opt.collType).then(resolve).catch(reject);
        alert()
      }
    })
  })
}


function addPostOpt(postId, userid, optName, collType) {
  return new Promise((resolve, reject) => {
    bushido.get(collType, postId).then(function(snapshot) {
      if (snapshot.exists()) {
        let data = snapshot.data();

        // property updation
        bushido.set(collType + '/' + postId, {
        [optName]: (data[optName] + 1)
        }, {
          merge: true
        }).then(function() {
          // adding doc
          bushido.set(optName + '/' + postId, function(sdk) {
            return { contents: sdk.arrayUnion(userid) }
          }, {
            merge: true
          }).then(resolve).catch(reject)
        }).catch(reject)
      }
    })
  })
}


function decreasePostOpt(postId, userid, optName, collType) {
  return new Promise((resolve, reject) => {

    bushido.get(collType, postId).then(function(snapshot) {
      if (snapshot.exists()) {
        let data = snapshot.data();

        // property updation
        bushido.set(collType + '/' + postId, {
        [optName]: (data[optName] - 1)
        }, {
          merge: true
        }).then(function() {
          // adding doc
          bushido.set(optName + '/' + postId, function(sdk) {
            return { contents: sdk.arrayRemove(userid) }
          }, {
            merge: true
          }).then(resolve).catch(reject)
        }).catch(reject)

      }
    })
  })
}