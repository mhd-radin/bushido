function pageonload() {
  if (spinner) {
    spinner.removePreloader().then(() => {
      if (typeof onpageloadin == 'function') {
        onpageloadin()
      }
    })
  } else if (typeof onpageloadin == 'function'){
    onpageloadin()
  }
}

document.body.onload = pageonload;

const app = {
  lettersToElem(elem) {
    elem.innerHTML = elem.innerHTML.replace(/\S/g, '<span class="letter">$&</span>');
    return elem;
  },
  preventLetters(elem){
    elem.innerHTML = elem.innerText;
  }
}