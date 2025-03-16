let sentCount = id('sentCount');
let statusInfo = id('statusInfo');
let cli = id('cliInfo');
let botInfo = id('activeInfo');

function createActiveInfoDot(isRed, text) {
  return `<div class="green-dot ${(isRed? 'red-color' : '')}"></div> ${text}`
}

function getInfo() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://wbot-bodg.onrender.com/status');
  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === xhr.DONE) {

      if (xhr.status == 200) {
        var res = JSON.parse(xhr.response);
        console.log(res)

        if (res.isClientLogged === true) {
          handleBotStatus(res.sendCount + '+', 'Messages are sent', true, true)
        } else {
          handleBotStatus('Warning', 'No client logged', false, true)
        }
      } else {
        handleBotStatus('ERROR', 'Servive currently unavailable', false, false)
      }
    }
  })
  xhr.send()
}

function handleBotStatus(sentCountInfo, sentDes, cliInfo = true, active) {
  var cliText = '';
  var activeText = '';
  if (cli) {
    cliText = 'Client Logged'
  } else {
    cliText = 'No Client Found!'
  }

  if (active == true) {
    activeText = 'Active'
  } else {
    activeText = 'No Service'
  }

  sentCount.innerHTML = sentCountInfo;
  statusInfo.innerHTML = sentDes;
  cli.innerHTML = cliText;
  botInfo.innerHTML = createActiveInfoDot((!active), activeText)
}

getInfo();