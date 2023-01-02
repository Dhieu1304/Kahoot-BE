const models = require('../models');

const findAllPresentationTheme = async () => {
  try {
    return await models.presentation_theme.findAll();
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findAllPresentationTheme,
};
