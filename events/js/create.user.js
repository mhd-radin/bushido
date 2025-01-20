const addPostBtn = document.getElementById('addPost');

addPostBtn.onclick = function () {
  modal.useDropdown(addPostBtn, [{
    label: 'Add your story',
    icon: 'video-outline',
    clickAction: function () {
      
    },
    id: 'addPostDdown'
  }], ['0'])
}