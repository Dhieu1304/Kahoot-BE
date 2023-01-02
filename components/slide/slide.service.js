const models = require('../models');
const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');

const editMultiSlide = async (presentation_id, slides) => {
  try {
    await models.slide.destroy({ where: { presentation_id: presentation_id } });
    return await models.slide.bulkCreate(slides);
  } catch (e) {
    console.error(e.message);
    return false;
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
    const slide = await models.slide.findOne({ where: { presentation_id, ordinal_slide_number } });
    if (slide && slide.body) {
      slide.body = JSON.parse(slide.body);
    }
    return slide;
  } catch (e) {
    console.error(e.message);
  }
};

const dataCountSlide = async (presentation_id, ordinal_slide_number) => {
  try {
    return await models.slide_data.findAll({
      where: { presentation_id, ordinal_slide_number },
      group: ['name'],
      attributes: ['name', [Sequelize.fn('COUNT', 'name'), 'count']],
      raw: true,
    });
  } catch (e) {
    console.error(e.message);
  }
};

const countSlidePresentation = async (presentation_id) => {
  try {
    return await models.slide.count({ where: { presentation_id } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  editMultiSlide,
  getAllSlidePresentation,
  findOneSlide,
  dataCountSlide,
  countSlidePresentation,
};
