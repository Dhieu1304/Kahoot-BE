const models = require('../models');

const editMultiSlide = async (presentation_id, slides) => {
  try {
    await models.slide.destroy({ where: { presentation_id: presentation_id } });
    return await models.slide.bulkCreate(slides);
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  editMultiSlide,
};
