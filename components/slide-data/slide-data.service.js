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
    return !!isDel;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const getSlideData = async (presentation_id, ordinal_slide_number) => {
  try {
    return await models.slide_data.findAll({
      where: { presentation_id, ordinal_slide_number },
      attributes: ['user_id', 'uid'],
      raw: true,
      nest: true,
    });
  } catch (e) {
    console.error(e.message);
  }
};

const getSlideDataUsers = async (presentation_id, ordinal_slide_number) => {
  const slideData = await getSlideData(presentation_id, ordinal_slide_number);
  const result = [];
  if (slideData && slideData.length > 0) {
    for (let i = 0; i < slideData.length; i++) {
      if (slideData[i].user_id) result.push(slideData[i].user_id);
      if (slideData[i].uid) result.push(slideData[i].uid);
    }
  }
  return result;
};

const getPresentationData = async (presentation_id) => {
  try {
    return await models.slide_data.findAll({
      where: { presentation_id },
      include: [
        {
          model: models.user,
          as: 'user',
          attributes: [['id', 'user_id'], 'full_name', 'avatar'],
        },
      ],
      attributes: { exclude: ['value', 'user_id', 'uid'] },
    });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  createNewSlideData,
  deleteAllExceptInput,
  deleteAllDataOfPresent,
  getSlideData,
  getSlideDataUsers,
  getPresentationData,
};
