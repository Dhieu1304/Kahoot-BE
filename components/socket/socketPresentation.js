const socketPresentation = (function () {
  let instance = null;
  function init() {
    const presentations = [];
    return {
      addPresentation: function (presentation_id, code, ordinal_slide_number, user_id, user_name) {
        const index = presentations.findIndex((presentation) => presentation.presentation_id === presentation_id);
        if (index === -1) presentations.push({ presentation_id, code, ordinal_slide_number, user_id, user_name });
        else {
          presentations[index].code = code;
          presentations[index].ordinal_slide_number = ordinal_slide_number;
        }
        console.log(presentations);
      },
      removePresentation: function (presentation_id, user_id) {
        const index = presentations.findIndex(
          (presentation) => presentation.presentation_id === presentation_id && presentation.user_id === user_id,
        );
        if (index !== -1) {
          presentations.splice(index, 1);
          return true;
        }
        return false;
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
      getTotalPresent: function () {
        return presentations.length;
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
