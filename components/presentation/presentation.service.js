const models = require('../models');

const findOneById = async (id) => {
  try {
    return await models.presentation.findOne({ where: { id: id } });
  } catch (e) {
    console.error(e.message);
  }
};

const listPresentation = async (user_id, limit, offset) => {
  try {
    return await models.presentation.findAndCountAll({
      include: [
        {
          model: models.presentation_theme,
          as: 'presentation_theme',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: models.presentation_member,
          as: 'presentation_members',
          where: { user_id: user_id },
          attributes: ['user_id'],
          include: {
            model: models.group_user_role,
            as: 'role',
            attributes: ['name'],
          },
        },
      ],
      attributes: ['id', 'name'],
      limit: limit,
      offset: offset,
    });
  } catch (e) {
    console.error(e.message);
  }
};

const createNewPresentation = async (presentation) => {
  try {
    return await models.presentation.create(presentation);
  } catch (e) {
    console.error(e.message);
  }
};

const updatePresentation = async (id, updateObj) => {
  try {
    return await models.presentation.update(updateObj, { where: { id: id } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOneById,
  listPresentation,
  createNewPresentation,
  updatePresentation,
};
