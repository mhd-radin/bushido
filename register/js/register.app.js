function onpageloadin() {
  console.log(4)
  const cssAnimListQuery = [
    '.reg-body h2',
    '.reg-body p',
    '.input-box label',
    '.input-icon',
    '.input-icon .eva',
    '.form input',
    '.right-elems'
    ]
  const delayScaleChild = [
    0,
    0,
    1,
    1,
    1,
    1,
    1
    ]
    
    const baseDelayChild = [
     0,
     200,
     1200,
     850,
     1250,
     450,
     850
    ]

  const delayScale = 80;

  cssAnimListQuery.forEach(function (query, i) {
    var delayScalePos = delayScaleChild[i];
    var baseDelayPos = baseDelayChild[i];
    
    if (delayScalePos === 0){
      var elem = document.querySelector(query);
      elem.style.animationDelay = baseDelayPos+'ms'
      elem.style.animationPlayState = 'running';
    } else {
      var elems = document.querySelectorAll(query).forEach(function(elem, eIndex){
        var elemStyle = window.getComputedStyle(elem, null);
        var currentDelay = elemStyle.getPropertyValue('animation-delay');
        
        elem.style.animationDelay = ((parseInt(currentDelay.replace('s', ''))*1000) + (delayScale * eIndex)+'ms');
        console.log(currentDelay)
        elem.style.animationPlayState = 'running';
      })
    }
  })
}

onpageloadin()