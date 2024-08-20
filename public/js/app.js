function pageonload() {
  if (typeof spinner != 'undefined') {
    spinner.removePreloader().then(() => {
      if (typeof onpageloadin == 'function') {
        onpageloadin()
      }
    })
  } else if (typeof onpageloadin == 'function') {
    onpageloadin()
  }

  if (typeof eva != 'undefined') {
    eva.replace()
  }

  document.querySelectorAll('*').forEach(function(elem) { elem.onerror = handleError })
}

document.body.onload = pageonload;
//window.onload = pageonload;

const app = {
  lettersToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(/\S/g, '<span class="letter">$&</span>');
    return elem;
  },
  wordsToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(/\b\w+\b/g, function(match) {
      return `<span class="word">${match}</span>`;
    })
    return elem;
  },
  preventLetters(elem) {
    elem.innerHTML = elem.innerText;
  },
  getDayDate(){
    var dt = new Date();
    return dt.getDay().toLocaleString('in', {minimumIntegerDigits: 2})+'-'+dt.getMonth().toLocaleString('in', {minimumIntegerDigits: 2})+'-'+dt.getFullYear();
  },
  redirectWithPreloader(path) {
    if (spinner) {
      spinner.showPreloader();
      setTimeout(function() {
        window.location.href = path
      }, 800)
    } else {
      window.location.href = path
    }
  },
  getQueryParams(href = window.location.href) {
    const url = new URL(href);
    const params = new URLSearchParams(url.search);
    const queryObject = {};

    for (const [key, value] of params) {
      queryObject[key] = value;
    }

    return queryObject;
  },
  validUser(){
    return new Promise((resolve, reject) => {
      if (localStorage.getItem('userUrl')){
        caches.open('user').then((cache)=>{
          cache.match(localStorage.getItem('userUrl')).then(function (res){
            if (res){
              res.json().then((obj)=>{
                if (obj){
                  resolve()
                } else {
                  reject('404: user not found')
                }
              }).catch(err=>reject(err))
            } else {
              reject('404: user not found')
            }
          }).catch(err=>reject(err))
        }).catch(err=>reject(err))
      } else {
        reject('user not found')
      }
    })
  }
}

if (typeof eva != 'undefined') {
  eva.replace()
}

function handleError(err) {
  alert(err)
}

window.onerror = handleError;