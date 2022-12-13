const models = require('../models');

const getAllParentSlideType = async () => {
  try {
    return await models.slide_parent_type.findAll();
  } catch (e) {
    console.error(e.message);
  }
};

const getAllSlideType = async () => {
  try {
    return await models.slide_parent_type.findAll({
      include: [
        {
          model: models.slide_type,
          as: 'slide_types',
          attributes: ['id', 'name'],
        },
      ],
    });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getAllParentSlideType,
  getAllSlideType,
};
