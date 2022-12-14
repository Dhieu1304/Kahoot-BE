const models = require('../models');

const editMultiSlide = async (presentation_id, slides) => {
  try {
    await models.slide.destroy({ where: { presentation_id: presentation_id } });
    return await models.slide.bulkCreate(slides);
  } catch (e) {
    console.error(e.message);
  }
};

const getAllSlidePresentation = async (presentation_id) => {
  try {
    return await models.slide.findAll({ where: { presentation_id } });
  } catch (e) {
    console.error(e.message);
  }
};

const findOneSlide = async (presentation_id, ordinal_slide_number) => {
  try {
    return await models.slide.findOne({ where: { presentation_id, ordinal_slide_number } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  editMultiSlide,
  getAllSlidePresentation,
  findOneSlide,
};
