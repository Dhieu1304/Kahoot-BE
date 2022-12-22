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

const deleteAllDataOfPresent = async (presentation_id) => {
  try {
    const isDel = await models.slide_data.destroy({ where: { presentation_id } });
    console.log('----------------------', isDel);
    return !!isDel;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports = {
  createNewSlideData,
  deleteAllExceptInput,
  deleteAllDataOfPresent,
};
