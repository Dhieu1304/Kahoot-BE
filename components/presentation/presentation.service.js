const models = require('../models');

const findOneById = async (id) => {
  try {
    return await models.presentation.findOne({ where: { id: id } });
  } catch (e) {
    console.error(e.message);
  }
};

const findOneByCode = async (code) => {
  try {
    return await models.presentation.findOne({ where: { code } });
  } catch (e) {
    console.error(e.message);
  }
};

const listPresentation = async (user_id, role = null) => {
  try {
    const options = {
      include: [
        {
          model: models.presentation_member,
          as: 'presentation_members',
          where: { user_id: user_id },
          attributes: [],
        },
      ],
      order: ['id'],
    };
    if (role) {
      options.include[0].include = [
        {
          model: models.group_user_role,
          as: 'role',
          where: { name: role },
          attributes: [],
        },
      ];
    }
    return await models.presentation.findAll(options);
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
              attributes: ['name'],
            },
            {
              model: models.user,
              as: 'user',
              attributes: ['id', 'email', 'full_name', 'avatar'],
            },
          ],
        },
      ],
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

const getPresentationByCodeOrId = async (presentation_id, code) => {
  if (presentation_id) {
    return await findOneById(presentation_id);
  } else if (code) {
    return await findOneByCode(code);
  }
  return null;
};

const checkUserPresentationGroup = async (id, user_id) => {
  try {
    const presentationGroup = await models.presentation.findAll({
      where: { id },
      include: [
        {
          model: models.presentation_group,
          as: 'presentation_groups',
          include: [
            {
              model: models.group,
              as: 'group',
              include: [
                {
                  model: models.group_user,
                  as: 'group_users',
                  where: { user_id },
                },
              ],
            },
          ],
        },
      ],
      raw: true,
    });
    for (let i = 0; i < presentationGroup.length; i++) {
      if (presentationGroup[i]['presentation_groups.group.group_users.user_id'] === user_id) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports = {
  findOneById,
  findOneByCode,
  listPresentation,
  createNewPresentation,
  updatePresentation,
  getDetailPresentation,
  deletePresentationById,
  deletePresentSession,
  getPresentationByCodeOrId,
  checkUserPresentationGroup,
};
