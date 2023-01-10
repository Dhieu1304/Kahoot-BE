const models = require('../models');
const { userService } = require('../service.init');
const { Op, Sequelize } = require('sequelize');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');
const { PRESENTATION_EVENT } = require('../socket/socket.constant');
const presentations = require('../socket/socketPresentation').getInstance();

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

const findAllPresentationInGroup = async (group_id) => {
  try {
    return await models.presentation_group.findAll({
      where: { group_id },
      include: [
        {
          model: models.presentation,
          as: 'presentation',
        },
      ],
      order: ['presentation_id'],
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

const getPresentingByGroupId = async (group_id) => {
  const presents = presentations.getAllPresent();
  const data = [];
  const presentGroup = await models.presentation_group.findAll({
    where: { group_id },
    include: [
      {
        model: models.presentation,
        as: 'presentation',
      },
    ],
  });
  for (let i = 0; i < presents.length; i++) {
    for (let j = 0; j < presentGroup.length; j++) {
      if (presents[i].presentation_id === presentGroup[j].presentation_id) {
        const user = await userService.findOneById(presents[i].user_id);
        delete user.password;
        delete user.refresh_token;
        data.push({ ...presents[i], presentation: presentGroup[j].presentation?.dataValues, user });
      }
    }
  }
  return data;
};

const updatePresentingGroup = async () => {
  try {
    console.log('================ updatePresentingGroup ====================');
    const presents = presentations.getAllPresent();
    const presentList = presents.map((item) => item.presentation_id);
    if (presentList.length < 1) {
      return;
    }
    const listPresentGroup = await models.presentation_group.findAll({
      where: {
        presentation_id: {
          [Op.in]: presentList,
        },
      },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('group_id')), 'group_id']],
      raw: true,
    });
    for (let i = 0; i < listPresentGroup.length; i++) {
      const data = await getPresentingByGroupId(listPresentGroup[i].group_id);
      _io.in(listPresentGroup[i].group_id.toString()).emit(PRESENTATION_EVENT.PRESENT_GROUP, data);
    }
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  findAllGroupPresentation,
  addGroupPresentation,
  removeGroupPresentation,
  findAllPresentationInGroup,
  getPresentingByGroupId,
  updatePresentingGroup,
};
