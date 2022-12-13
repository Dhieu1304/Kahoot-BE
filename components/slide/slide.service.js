const models = require('../models');

const createNewSlide = async (slide) => {
  try {
    return await models.slide.create(slide);
  } catch (e) {
    console.error(e.message);
  }
};

const findMaxOrdinalSlideInPresentation = async (presentation_id) => {
  try {
    const data = await models.slide.findaLL({
      attributes: [[sequelize.fn('max', sequelize.col('ordinal_slide_number')), 'max_number']],
      where: { presentation_id: presentation_id },
    });
    return data[0]?.max_number || 0;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  createNewSlide,
  findMaxOrdinalSlideInPresentation,
};
