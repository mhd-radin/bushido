function pageonload() {
  if (spinner) {
    spinner.removePreloader().then(() => {
      if (typeof onpageloadin == 'function') {
        onpageloadin()
      }
    })
  } else if (typeof onpageloadin == 'function') {
    onpageloadin()
  }
  
  if (eva){
    eva.replace()
  }
}

document.body.onload = pageonload;

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

if (eva){
  eva.replace()
}