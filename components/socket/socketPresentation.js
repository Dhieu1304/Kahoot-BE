const socketPresentation = (function () {
  let instance = null;
  function init() {
    const presentations = [];
    return {
      addPresentation: function (presentation_id, code, ordinal_slide_number) {
        const index = presentations.findIndex((presentation) => presentation.presentation_id === presentation_id);
        if (index === -1) presentations.push({ presentation_id, code, ordinal_slide_number });
        else {
          presentations[index].code = code;
          presentations[index].ordinal_slide_number = ordinal_slide_number;
        }
      },
      removePresentation: function (presentation_id) {
        const index = presentations.findIndex((presentation) => presentation.presentation_id === presentation_id);
        if (index !== -1) {
          presentations.splice(index, 1);
        }
      },
      findCurrentSlideByPresentationId: function (presentation_id) {
        const slide = presentations.find((presentation) => presentation.presentation_id === presentation_id);
        if (slide) {
          return Object.assign({}, slide);
        }
        return false;
      },
      findCurrentSlideByCode: function (code) {
        const slide = presentations.find((presentation) => presentation.code === code);
        if (slide) {
          return Object.assign({}, slide);
        }
        return false;
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) instance = init();
      return instance;
    },
  };
})();

module.exports = socketPresentation;
