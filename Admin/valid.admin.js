const handleLogin = (err) => {
  window.location.href = '../register';
}
if (caches) {
  caches.open('admin').then(function(cache) {
    if (localStorage.getItem('adminUrl')) {
      cache.match(localStorage.getItem('adminUrl')).then(function(res) {
        if (res) {
          res.json().then(function(data) {
            if (localStorage.getItem('adminKey') === data.key) {
              // continues 
            } else {
              handleLogin('key not match')
            }
          })
        } else { handleLogin(res) }
      }).catch(handleLogin)
    } else {
      handleLogin('not found url')
    }
  }).catch(handleLogin)
}