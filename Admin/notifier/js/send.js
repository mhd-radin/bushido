function send(auth, token, notification) {
  var xhr = new XMLHttpRequest();
  var link = (
    'https://fcm.googleapis.com/v1/projects/bushido-2024/messages:send'
  )

  xhr.open('POST', link);

  xhr.setRequestHeader('Authorization',
    'Bearer ' + auth)
  xhr.setRequestHeader('Content-Type',
    'application/json')

  xhr.addEventListener(
    'readystatechange',
    function() {
      if (xhr.DONE === xhr
        .readyState) {
        var res = xhr.response;
        console.log(res)
      }
    })

  const data = {
    "message": {
      "token": token,
      "notification": notification
    }
  }


  xhr.send(JSON.stringify(data))
}

function onformend(data) {
  console.log(data)
  send(
    'ya29.a0ARW5m75vaGzj_FPtBLaQQ4faAiGkO_s71PjY-kMkhZ2gQ0SKPZ7vsIdX9PPUiBr6-UyEWA2Me0lm-rOYAgstdm7_4oFOmvf_eob8JTAtVBAjDDLc6FlNzzDC8wKeal-eyNdnuYNoP_X2YVxVMtzHHBDiYs-_IMG2BKHWWoj3aCgYKAcQSARASFQHGX2MiiVaPUZL1NfpRtKkkL9HlDQ0175',
    'cbgfdmbAfB2h84g-l0By2-:APA91bEVVOeYbiqogs1eXBmpgYVAH6vEXhdSj3aQ6MQaFFk3JsX-HXegYqNLbdKJly-68HqnmS8-dLNiUr7ISS3mrEwK-WrJtFxL82Sz7-23d5ZsBKaL3rs',
    {
      "body": data.title,
      "title": data.des
    }
  )
}