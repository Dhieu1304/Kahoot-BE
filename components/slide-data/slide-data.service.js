const models = require('../models');
const { Op } = require('sequelize');

const createNewSlideData = async (slideDataObj) => {
  try {
    await models.slide_data.create(slideDataObj);
  } catch (e) {
    console.error(e.message);
  }
};

const deleteAllExceptInput = async (presentation_id, ordinal_slide_number, except) => {
  try {
    return await models.slide_data.destroy({
      where: {
        presentation_id,
        ordinal_slide_number,
        name: { [Op.notIn]: except },
      },
    });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  createNewSlideData,
  deleteAllExceptInput,
};
