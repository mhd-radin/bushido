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

/* https://accounts.google.com/o/oauth2/v2/auth?
 scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly%20https%3A//www.googleapis.com/auth/calendar.readonly&
 include_granted_scopes=true&
 response_type=token&
 state=state_parameter_passthrough_value&
 redirect_uri=https%3A//oauth2.example.com/code&
 client_id=client_id */

 function getFragmentProperties(url) {
  // Extract the fragment part after '#'
  const fragment = url.split('#')[1];
  if (!fragment) return null;

  // Parse the fragment string into an object
  return fragment.split('&').reduce((params, pair) => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
      return params;
  }, {});
}

// Example usage
const url = "https://oauth2.example.com/callback#access_token=4/P7q7W91&token_type=Bearer&expires_in=3600";
const properties = getFragmentProperties(url);

console.log(properties);
// Output:
// {
//   access_token: "4/P7q7W91",
//   token_type: "Bearer",
//   expires_in: "3600"
// }
