const addPostBtn = document.getElementById('addPost');

addPostBtn.onclick = function () {
  modal.useDropdown(addPostBtn, [{
    label: 'Add Story',
    icon: 'video-outline',
    clickAction: function () {
      
    },
    id: 'addPostDdown'
  }], ['0'])
}