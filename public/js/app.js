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
  
  if (typeof eva != 'undefined'){
    eva.replace()
  }
  
  document.querySelectorAll('*').forEach(function(elem){elem.onerror = handleError})
}

document.body.onload = pageonload;
//window.onload = pageonload;

const app = {
  lettersToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(/\S/g, '<span class="letter">$&</span>');
    return elem;
  },
  preventLetters(elem) {
    elem.innerHTML = elem.innerText;
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
  }
}

if (typeof eva != 'undefined'){
  eva.replace()
}

function handleError(err) {
  alert(err)
}

window.onerror = handleError;