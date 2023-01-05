const convertDataSlide = (bodySlide, data) => {
  if (data && data.length > 0) {
    for (let i = 0; i < bodySlide.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (bodySlide[i].name === data[j].name) {
          bodySlide[i].value = data[j].count;
        }
      }
    }
  } else {
    for (let i = 0; i < bodySlide.length; i++) {
      bodySlide[i].value = 0;
    }
  }
};

module.exports = convertDataSlide;
