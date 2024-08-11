function onpageloadin() {
  bushido.getCollection('accounts').then(function(snapshot) {
    var arr = bushido.toData(snapshot)
    var elem = document.querySelector('.card-box-body#userslist');
    elem.innerHTML = ''
    arr.forEach(function(item, index) {
      var data = item.data();
      elem.appendChild(userboxUI.create(
        data.fullname,
        data.email,
        'https://api.dicebear.com/9.x/initials/svg?seed=' + data.fullname + '&radius=40').parseElement()[0])
    })
    document.getElementById('userTotalInfo').innerHTML = 'no one registered ( Total: ' + arr.length + ', Registered: 0 )'
  })
}