const models = require('../models');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');

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
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: models.presentation_member,
          as: 'presentation_members',
          where: { user_id: user_id },
          include: [
            {
              model: models.group_user_role,
              as: 'role',
              attributes: ['name'],
            },
            {
              model: models.user,
              as: 'user',
              attributes: ['id', 'email', 'full_name', 'avatar'],
            },
          ],
          attributes: ['createdAt', 'updatedAt'],
        },
      ],
      // attributes: { exclude: ['createdAt', 'updatedAt'] },
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

const getDetailPresentation = async (id) => {
  try {
    return await models.presentation.findOne({
      where: { id },
      include: [
        {
          model: models.presentation_theme,
          as: 'presentation_theme',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: models.presentation_type,
          as: 'presentation_type',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        {
          model: models.presentation_member,
          as: 'presentation_members',
          include: [
            {
              model: models.group_user_role,
              as: 'role',
              where: { name: GROUP_USER_ROLE.OWNER },
              attributes: ['name'],
            },
            {
              model: models.user,
              as: 'user',
              attributes: ['id', 'email', 'full_name', 'avatar'],
            },
          ],
          attributes: ['createdAt', 'updatedAt'],
        },
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  } catch (e) {
    console.error(e.message);
  }
};

const deletePresentationById = async (id) => {
  try {
    await models.presentation_member.destroy({ where: { presentation_id: id } });
    await models.slide_data.destroy({ where: { presentation_id: id } });
    await models.slide.destroy({ where: { presentation_id: id } });
    await models.presentation.destroy({ where: { id } });
  } catch (e) {
    console.error(e.message);
  }
};

const deletePresentSession = async (presentation_id) => {
  try {
    await models.slide_data.destroy({ where: { presentation_id } });
    await models.slide_question.destroy({ where: { presentation_id } });
    await models.slide_message.destroy({ where: { presentation_id } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOneById,
  listPresentation,
  createNewPresentation,
  updatePresentation,
  getDetailPresentation,
  deletePresentationById,
  deletePresentSession,
};
