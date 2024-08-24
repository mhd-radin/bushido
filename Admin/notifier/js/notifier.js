let floater = document.getElementById('floater');
let floatDefualtIndex = app.getCSSProp('z-index', floater)
let floatDefualtBottom = app.getCSSProp('bottom', floater)
let floatDefualtRight = app.getCSSProp('right', floater)

floater.onclick = function() {
  document.querySelector('.form-display').style.display = 'block'
  floater.style.display = 'none';
  floater.style.animationDelay = '0ms'
  document.querySelector('.form-display').onanimationend = function() {
    setTimeout(function() {
      floater.style.display = 'block'
    }, 500)
  }
  floater.style.zIndex = (floatDefualtIndex + 100);
  floater.style.bottom = '30px'
  floater.style.right = '30px';
  floater.innerHTML = '<p>Next</p>'

  floater.onclick = function() {
    var form = document.querySelector('.form');
    anime.timeline({
      loop: false
    }).add({
      targets: form.querySelectorAll('*'),
      translateY: ['0px', '-50%'],
      opacity: [1, 0],
      delay: (el, i) => (i * 200),
      duration: 850,
      complete: function() {
        form.innerHTML = `<i class="close-btn eva eva-close-outline"></i>
<div class="form-center">
  <p>Enter description for notification</p>
  <textarea type="text" name="des" id="des" value="" class='large-input' placeholder="Enter Description"></textarea>
</div>`
        anime.set({
          targets: form.querySelectorAll('*'),
          translateY: 0,
          opacity: 1,
        })

        floater.onclick = function() {
          var form = document.querySelector('.form');
          anime.timeline({
            loop: false
          }).add({
            targets: form.querySelectorAll('*'),
            translateY: ['0px', '-50%'],
            opacity: [1, 0],
            delay: (el, i) => (i * 200),
            duration: 850,
            complete: function() {
              form.innerHTML = `<i class="close-btn eva eva-close-outline"></i>
<div class="form-center">
  <p>Choose an Category</p>
  <select name="cate" id="cate">
    <option value="cate">Information</option>
    <option value="cate">About Payment</option>
    <option value="cate">Request</option>
    <option value="cate">Warning</option>
    <option value="cate">Emergency</option>
    <option value="cate">Events</option>
  </select>
</div>`
              anime.set({
                targets: form.querySelectorAll('*'),
                translateY: 0,
                opacity: 1,
              })

              floater.onclick = function() {

                modal.alert('Select user to send', () => {
                  return userboxUI.create('Name', 'subname', 'https://api.dicebear.com/9.x/shapes/svg?seed=Bjrt&radius=50&size=58', userboxUI.input('648'))
                }, '')
              }
            }
          })
        }
      }
    })
  }
}