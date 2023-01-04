const models = require('../models');

const findAllGroupPresentation = async (presentation_id) => {
  try {
    return await models.presentation_group.findAll({
      where: { presentation_id },
      include: [
        {
          model: models.group,
          as: 'group',
        },
      ],
    });
  } catch (e) {
    console.log(e.message);
  }
};

const addGroupPresentation = async (presentation_id, group_id) => {
  try {
    return await models.presentation_group.create({ presentation_id, group_id });
  } catch (e) {
    console.log(e.message);
  }
};

const removeGroupPresentation = async (presentation_id, group_id) => {
  try {
    return await models.presentation_group.destroy({ where: { presentation_id, group_id } });
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  findAllGroupPresentation,
  addGroupPresentation,
  removeGroupPresentation,
};
