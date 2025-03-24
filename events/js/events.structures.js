const CardStructure = {
  story: {
    create(id, thumb, author, des, authorAvatar, timeInfo) {
      return (new TagString(`
<div class="story-container">
  <div class="story-shadow"></div>
  <img src="${thumb}" alt="${des}" class="story-img">
  <div class="story-bottom">
    <div class="story-divider">
      <div class="story-avatar">
        <img src="${authorAvatar}" alt="">
      </div>
      <div class="story-about">
        <div class="story-author">${author}</div>
        <div class="story-des">${des}
        </div>
      </div>
    </div>
    <div class="story-date">${timeInfo}</div>
  </div>
</div>
`)).setOptions({
        id
      });
    }
  },
  addLinearBox(id, name){
    q('.main-session .contents').appendChild(new TagString(
      `   <div class="linear-box ${id}-box">
            <div class="linear-head">
              ${name}
            </div>
            <div class="linear-contents">
              
            </div>
          </div>`
      ).parseElement()[0])
  },
  video: {
    create(id, thumb, title, des, tags) {
      return (new TagString(`
<div class="image-card video-card">
  <div class="img-container">
    <img src="${thumb}" alt="" class="img-content" />
    <i class="play-icon eva eva-arrow-right"></i>
    ${(Array.isArray(tags) ? `<div class="post-tags">
                    ${(tags.map((arr)=> `<div class="post-tag ${arr[2]}">
                      <i class="eva eva-${arr[0]}"></i>
                      <span>${arr[1]}</span>
                    </div>`)).join('')}
                  </div>` : '')}
  </div>
  <div class="image-card-body">
    <div class="image-card-texts">
      <div class="image-card-title">${title}</div>
      <div class="image-card-subtext">
        ${des}
      </div>
    </div>
  </div>
</div>
`)).setOptions({
        id
      })
    }
  },
  createPoster(id, thumbSrc) {
    return new TagString(`
<div class="poster-card" id="${id}">
  <img src="${thumbSrc}" alt="Poster">
</div>
`)
  },
  notes: {
    create(id, title, des, buttons = '') {
      return new TagString(`
    <div class="note-card" id="${id}">
            <div class="note-ripple"></div>
            <div class="note-title">${title}</div>
            <div class="note-subtext">
              ${des}
            </div>
            <div class="note-buttons">
              ${buttons}
            </div>
          </div>
    `)
    }
  }
}