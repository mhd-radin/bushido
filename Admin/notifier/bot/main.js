const eventSource = new EventSource('https://wbot-bodg.onrender.com/events/');

eventSource.onmessage = (event) => {
  var d = JSON.parse(event.data)
  write('✓ message received: '+d.body.fontcolor('yellow'), 'green')
};


eventSource.onerror = (err) => {
  console.log(err)
  console.error("Error with SSE connection");
  write('ERROR SSE!', 'red')
};

function write(msg, color = '#fff') {
  document.getElementById('l').innerHTML += '\n ' + msg.fontcolor(color)
}

function getLoggs() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://wbot-bodg.onrender.com/writed');
  xhr.setRequestHeader('Content-Type', 'application/json');
  
  xhr.addEventListener('readystatechange', function(){
    if (xhr.readyState === 4) {
      var res = JSON.parse(xhr.response);
      res.forEach(function (val) {
        write(val.write + ' @['.bold().fontcolor('orange')+val.date.bold().fontcolor('green')+']'.bold().fontcolor('orange'))
      })
    }
  })
  
  xhr.send()
}


write('Bot Started.');
write('Waiting for message receive.', '#ccc')
getLoggs()

