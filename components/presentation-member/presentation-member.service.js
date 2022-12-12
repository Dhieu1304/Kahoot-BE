const models = require('../models');
const { groupUserRoleService } = require('../service.init');
const { where, Op } = require('sequelize');

const findOnePresentationMember = async (user_id, role_id, presentation_id) => {
  try {
    return await models.presentation_member.findOne({
      where: { user_id: user_id, role_id: role_id, presentation_id: presentation_id },
    });
  } catch (e) {
    console.error(e.message);
  }
};

const createNewPresentationMember = async (user_id, role_id, presentation_id) => {
  try {
    return await models.presentation_member.create({ user_id, role_id, presentation_id });
  } catch (e) {
    console.error(e.message);
  }
};

const checkCanEdit = async (user_id, presentation_id) => {
  try {
    const editRoleId = await groupUserRoleService.findIdCanEdit();
    const canEdit = await models.presentation_member.findAll({
      where: { user_id: user_id, presentation_id: presentation_id, role_id: { [Op.in]: editRoleId } },
    });
    return canEdit && canEdit.length > 0;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOnePresentationMember,
  createNewPresentationMember,
  checkCanEdit,
};
