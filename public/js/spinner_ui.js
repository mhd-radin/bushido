const spinner = {
  elem: document.querySelector(".preloader"),
  create(text) {
    return new TagString(`<div class="preloader">
<svg class="svgloader" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0%" y="0%" width="100%" height="100%" viewBox="0 0 524.0 524.0" enable-background="new 0 0 524.0 524.0" xml:space="preserve">
	<path fill="#FF0047" stroke="#FF0000" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M63.06,248.33C91.07,236.18,119.09,224.03,155.94,209.80C192.80,195.58,238.49,179.28,265.98,170.36C293.48,161.44,302.77,159.89,312.07,158.35C327.27,155.90,342.46,153.44,353.11,152.54C363.75,151.63,369.85,152.27,375.94,152.91C351.26,165.85,326.59,178.79,298.57,193.22C270.55,207.65,239.18,223.56,201.48,247.81C163.77,272.06,119.73,304.64,92.97,327.16C66.21,349.67,56.74,362.11,49.30,371.73C41.86,381.35,36.45,388.16,31.63,397.80C26.81,407.44,22.58,419.92,18.34,432.40C46.61,433.05,74.87,433.70,114.53,433.61C154.18,433.52,205.22,432.69,256.27,431.87C269.04,430.82,281.81,429.78,296.18,423.99C310.55,418.21,326.51,407.68,342.47,397.15C349.90,388.91,357.33,380.67,363.36,371.32C369.38,361.98,374.00,351.52,378.62,341.07C379.26,336.09,379.90,331.11,380.10,327.26C380.30,323.40,380.05,320.68,379.80,317.95C379.24,314.76,378.68,311.58,376.52,306.91C374.36,302.23,370.60,296.07,368.01,292.02C365.42,287.98,364.00,286.05,361.45,283.60C358.91,281.14,355.24,278.17,351.86,275.64C348.48,273.12,345.38,271.04,342.77,269.42C340.16,267.80,338.03,266.63,334.22,264.74C330.40,262.84,324.90,260.23,319.40,257.61C335.95,250.34,352.50,243.08,363.40,232.20C374.30,221.32,379.54,206.83,384.78,192.33Q387.62,179.78,387.62,166.68L410.38,157.37L435.24,144.57L511.66,108.57L373.46,135.48C367.35,124.79,361.24,114.09,350.19,106.51C339.13,98.93,323.14,94.46,313.79,91.80C304.45,89.14,301.74,88.28,292.31,87.88C282.87,87.47,266.71,87.52,250.54,87.56L101.01,87.89L63.06,248.33z" class="svg-elem-1"></path>
	<path fill="#FFFFFF" stroke="#FFFFFF" fill-opacity="0.992" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M286.89,153.26L286.89,144.67L166.81,144.67L159.04,189.43Q231.18,168.05,286.89,153.26z" class="svg-elem-2"></path>
	<path fill="#FFFFFF" stroke="#FFFFFF" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M175.42,367.99L179.53,346.30L184.77,326.54L185.89,323.58L187.67,323.00L188.98,322.89L191.30,323.44L193.23,324.04L215.63,333.78L216.09,334.78L215.86,335.63L215.44,339.39L216.31,340.71L219.42,342.34L220.94,343.75L235.00,353.98L235.47,355.39L235.08,357.03L234.07,358.28L232.88,359.09L219.83,371.34L217.77,371.57L216.53,371.53L214.89,370.90L213.74,369.71L207.91,363.45L206.77,364.17L206.48,365.48L205.91,370.05L205.03,371.04L203.82,371.00L200.78,370.94L197.55,370.05L175.70,367.76" class="svg-elem-3"></path>
	<path fill="#FFFFFF" stroke="#FDFDFD" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M163.34,282.84C164.63,282.84,165.68,283.86,165.68,285.13C165.68,286.39,164.63,287.41,163.34,287.41C162.04,287.41,160.99,286.39,160.99,285.13C160.99,283.86,162.04,282.84,163.34,282.84z" class="svg-elem-4"></path>
	<path fill="#FFFFFF" stroke="#FCFCFC" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M176.78,283.43L208.17,283.15L206.29,287.01L175.58,287.13L174.43,285.01L176.78,283.43z" class="svg-elem-5"></path>
	<path fill="#FFFFFF" stroke="#FFFFFF" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M188.04,290.97L195.31,291.14L202.08,291.41L200.66,294.96L187.56,294.92L186.26,292.84L188.04,290.97z" class="svg-elem-6"></path>
	<path fill="#FFFFFF" stroke="#FFFFFF" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M193.19,316.66L216.10,327.95L219.81,322.71L221.32,322.97L221.90,325.15L224.85,333.17L228.05,336.91L229.83,337.94L231.03,338.32L231.80,338.29L233.94,337.86L239.98,333.50L245.05,329.12L247.03,327.67L249.01,327.13L250.79,327.16L253.30,326.99L255.48,326.42L257.53,324.70L260.69,321.80L263.67,318.00L265.87,314.48L266.02,311.63L264.43,307.80L262.79,306.22L260.69,304.43L258.55,302.15L255.96,301.03L252.81,299.13L250.00,299.16L247.47,299.60L245.12,301.59L242.75,304.05L240.73,306.31L239.39,308.47L237.88,310.58L237.70,313.14L237.49,316.29L237.29,319.31L237.33,320.15L233.97,320.22L233.69,318.18L233.22,315.53L232.51,311.49L231.22,305.28L229.95,300.67L227.95,297.05L225.53,292.42L225.37,290.56L226.32,289.32L227.65,289.06L228.77,290.13L230.58,291.94L231.71,294.66L233.49,297.83L234.49,301.39L236.07,302.61L237.23,302.19L239.55,300.57L242.39,297.26L246.53,295.90L249.00,295.65L251.27,295.07L255.32,295.55L257.45,296.04L259.59,297.53L261.90,298.85L263.52,300.98L265.44,303.02L267.57,303.46L269.37,303.93L272.70,303.28L281.09,301.80L289.81,302.93C291.39,303.68,292.96,304.43,294.87,304.57C296.77,304.71,299.01,304.24,301.24,303.77C304.74,303.29,308.24,302.80,309.71,299.44C311.18,296.08,310.64,289.85,309.71,286.37C308.78,282.89,307.48,282.17,305.74,281.18C304.00,280.20,301.82,278.95,298.66,279.09C295.49,279.24,291.34,280.78,287.19,282.32L253.29,282.12C253.52,276.74,253.75,271.36,251.46,268.21C249.18,265.06,244.38,264.14,239.58,263.22C235.25,263.34,230.92,263.46,228.29,266.32C225.67,269.17,224.75,274.75,223.83,280.33L221.26,280.33L219.29,280.50L216.43,281.87L208.17,291.41L201.10,302.07L193.19,316.66z" class="svg-elem-7"></path>
	<path fill="#FFFFFF" stroke="#FFFFFF" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M263.15,418.00A7.20 6.87 -0.00 1 0 274.07,411.28L244.28,365.72L239.20,362.92L228.40,371.06L234.01,375.45L263.15,418.00z" class="svg-elem-8"></path>
	<path fill="#FFFFFF" stroke="#FFFFFF" fill-opacity="1.000" stroke-opacity="1.000" fill-rule="nonzero" stroke-width="1.7831705" stroke-linejoin="miter" stroke-linecap="square" d="M198.04,377.29L194.99,386.04L157.04,421.50A8.20 8.05 -0.00 1 1 143.48,412.46L180.63,379.51L181.03,375.45L198.04,377.29z" class="svg-elem-9"></path>
</svg>
    <p>${text}</p>
  </div>`);
  },
  timer: null,
  showPreloader(text = "") {
    var self = this;
    this.elem = document.querySelector(".preloader");
    if (!this.elem) {
      var box = this.create(text);
      var parsedElem = box.parseElement()[0];
      document.body.appendChild(parsedElem);
      this.elem = parsedElem;
      
      spinner.timer = setInterval(function () {
        document.querySelectorAll('.svgloader, .preloader *').forEach(function (el) {
          var cs = getComputedStyle(el).getPropertyValue('animation');
          el.style.animation = 'none'
          setTimeout(function(){
          el.style.animation = cs
          }, 100)
        })
      }, 4000)
    }
    this.elem.style.display = "flex";
  },
  changeText(text) {
    this.elem.querySelector("p").innerHTML = text;
  },
  removePreloader() {
    // spinnerOneElem
    this.elem = document.querySelector(".preloader");

    const self = this;
    return new Promise((resolve) => {
      if (self.elem) {
        const spinnerOneElem = getComputedStyle(self.elem, ":after");
        const spinnerTwoElem = getComputedStyle(self.elem, ":before");

        var elem = self.elem;
        var a = anime({
          targets: ".preloader p",
          duration: 500,
          opacity: [1, 0],
          easing: "easeInOutQuad",
        }).finished.then(() => {
          anime({
            targets: ".preloader .loader",
            easing: "easeInOutQuad",
            duration: 500,
            loop: false,
            opacity: [1, 0],
            scale: ["1, 1", "0, 0"],
            delay: (e, i) => 350 * i,
          });

          anime({
            targets: ".preloader",
            easing: "easeInOutQuad",
            duration: 200,
            opacity: [1, 0],
            delay: 500,
            scaleX: [1, 0.8],
            scaleY: [1, 0.8],
          }).finished.then(() => {
            elem.remove();
            resolve(0);
          });
        });
      }
    });
  },
};

//spinner.showPreloader('');
