let keyBtn = id('password');
let idBtn = id('adminId')
keyBtn.onclick = function() {
  modal.prompt('Current admin key', '', 'CODE HERE').then((userEnteredCode) => {
    bushido.get('adminKey', 'adminkey_2626').then(function(snapshot) {
      const key = snapshot.data().key;
      if (key === userEnteredCode) {
        modal.prompt('New admin key', '', 'Key').then((newCode) => {
          if (newCode) {
            bushido.set('adminKey/adminkey_2626', {
              key: newCode
            }, {
              merge: true
            }).then(()=>{alert('Changed!')})
          }
        })
      } else {
        alert('Key mismatch')
      }
    })
  })
}
