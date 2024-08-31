const notificationUI = {
  createForm(title, inputBody) {
    return new TagString(`<i class="close-btn eva eva-close-outline" onclick="notificationUI.closeForms()"></i>
<div class="form-center">
  <p>${title}</p>
  ${inputBody}
</div>`);
  },
  createInput(id, isTextarea = false, type) {
    if (isTextarea) {
      return new TagString(
        `<textarea id="${id}" name="${id}" type="${type}" class="large-input"></textarea>`
      );
    }
    return new TagString(`<input type="${type}" name="${id}" id="${id}" />`);
  },
  closeForms() {
    document.querySelector(".form-display").style.display = "none";
    document.querySelector(".form-display .form").innerHTML =
      notificationUI.createForm(
        "Enter title for notification",
        notificationUI.createInput("title", false, "text").setAttributes({
          placeholder: "Enter Title",
        })
      );

    floater.style.zIndex = floatDefualtIndex;
    floater.style.bottom = floatDefualtBottom;
    floater.style.right = floatDefualtRight;
    floater.innerHTML = "<i class='eva eva-paper-plane-outline'></i>";
    floater.onclick = handleFloaterClick;
  },
};
