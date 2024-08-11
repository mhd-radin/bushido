function onpageloadin() {
  bushido.getCollection('accounts').then(function(snapshot) {
    var arr = bushido.toData(snapshot)
    var elem = document.querySelector('.users-list');
    elem.innerHTML = ''
    arr.forEach(function(item, index) {
      var data = item.data();
      elem.appendChild(userboxUI.create(
        data.fullname,
        (data.isAdmin == true ? 'Special Access' : data.email),
        'https://api.dicebear.com/9.x/initials/svg?seed=' + data.fullname + '&radius=40',
        (data.isAdmin == true ? userboxUI.tag('Admin') : '')).parseElement()[0])
    })
    document.getElementById('bodyTitle').innerHTML = 'Total ' + arr.length + ' users'
  })
}