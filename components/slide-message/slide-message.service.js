const models = require('../models');

const createNewSlideMessage = async (slideMessageObj) => {
  try {
    return await models.slide_message.create(slideMessageObj);
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const deleteAllPreSession = async (presentation_id) => {
  try {
    return await models.slide_message.destroy({
      where: {
        presentation_id,
      },
    });
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports = {
  createNewSlideMessage,
  deleteAllPreSession,
};
