const models = require('../models');

const findOnePresentationMember = async (user_id, role_id, presentation_id) => {
  try {
    return await models.presentation_member.findOne({
      where: { user_id: user_id, role_id: role_id, presentation_id: presentation_id },
    });
  } catch (e) {
    console.error(e.message);
  }
};

const createNewPresentationMember = async (presentationMember) => {
  try {
    return await models.presentation.create(presentationMember);
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOnePresentationMember,
  createNewPresentationMember,
};
