let showNotificationsBtn = document.getElementById('showNotifications');
let body = document.getElementById('body');
let bodySec = document.getElementById('bodySec');
let qrBtn = document.getElementById('qrBtn');
let logBtn = document.getElementById('logBtn');

showNotificationsBtn.onclick = function() {
  body.style.display = 'block'
  bodySec.style.display = 'none'
}

const URL_ENDPOINT = bushido.BOT_URL_ENDPOINT;

function getQR() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", URL_ENDPOINT);
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == xhr.DONE) {
      if (xhr.status == 200) {
        document.getElementById("qrCodes").innerHTML = "";
        new QRCode(document.getElementById("qrCodes"), xhr.response);
      }
    }
  });

  xhr.send();
}

qrBtn.onclick = function() {
  modal.alert('QR Code', `
  <div id="qrCodes" ></div>
  `, 'coated', function(modalId, buttonId) {
    getQR()
    
    document.getElementById(modalId).querySelector('.modal').classList.add('expanded')
    
    var btnElem = modal.button('Update', 'sec-btn',
      'updateQR').parseElement()[0];
      
    document.getElementById(modalId)
      .querySelector('.modal-right').appendChild(btnElem)
    
    btnElem.onclick = function () {
      getQR();
    }
  })
}

logBtn.onclick = function() {
  modal.alert('Bot Loggs', `
  <iframe id="botframe" src="bot/index.html"></iframe>
  `, 'coated', function(modalId, buttonId) {
    document.getElementById(modalId).querySelector('.modal').classList.add('expanded')
  })
}