modal.calendar = function (title, from, end) {
  
  return new Promise((resolve, reject) => {
    var ID = 'CLNDR_' + Math.floor(Math.random() * 888);
    var mainID = ID + '_MAIN';
    var yearsString = '';
    var fromYear = parseInt(dayjs(from).format('YYYY'));
    var endYear = parseInt(dayjs(end).format('YYYY'));
    var currentYear = fromYear;
    
    for (var i = fromYear; i < endYear; i++) {
      yearsString += '<option value="">'+(i)+'</option>'
    }
    
    var tagstr = this.create(this.title(title),
      `        <div class="modal-tabs">
          <select id="${ID}_YYYY">
            ${yearsString}
          </select>
          <select id="${ID}_MM">
            <option value="2020">March</option>
          </select>
        </div>
        <div class="days">
          <label for="day" class="day">01 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">02 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">03 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">04 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">05 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">06 <input type="radio" name="day" id="day"></label>
          <label for="day7" class="day active-day">07 <input type="radio" name="day7" id="day7"></label>

          <label for="day" class="day">01 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">02 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">03 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">04 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">05 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">06 <input type="radio" name="day" id="day"></label>
          <label for="day7" class="day active-day">07 <input type="radio" name="day7" id="day7"></label>

          <label for="day" class="day">01 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">02 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">03 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">04 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">05 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">06 <input type="radio" name="day" id="day"></label>
          <label for="day7" class="day active-day">07 <input type="radio" name="day7" id="day7"></label>

          <label for="day" class="day">01 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">02 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">03 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">04 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">05 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">06 <input type="radio" name="day" id="day"></label>
          <label for="day7" class="day active-day">07 <input type="radio" name="day7" id="day7"></label>

          <label for="day" class="day">01 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">02 <input type="radio" name="day" id="day"></label>
          <label for="day" class="day">03 <input type="radio" name="day" id="day"></label>
        </div>`,
      this.rightElem(
        this.button('Pick', '', ID)),
      '',
      '',
      mainID
    );


    this.add(tagstr)
    document.getElementById(ID).onclick = function() {
      if (document.getElementById(mainID)) {
        document.getElementById(mainID).children[0].style.animation = 'ClosePopup 0.5s 1';
        document.getElementById(mainID).children[0].onanimationend = function() {
          document.getElementById(mainID).remove()
          resolve()
        }
      }
    }
  })
}

modal.calendar('Choose', '2000-01-31', '2024-01-01')