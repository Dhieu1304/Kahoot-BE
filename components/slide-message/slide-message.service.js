const models = require('../models');

const createNewSlideMessage = async (presentation_id, message, user_id = null) => {
  try {
    console.log(presentation_id, message, user_id);
    return await models.slide_message.create({ presentation_id, user_id, message });
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const deleteAllPreSession = async (presentation_id) => {
  try {
    return await models.slide_message.destroy({ where: { presentation_id } });
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const findByPresentationId = async (presentation_id, page, limit) => {
  try {
    return await models.slide_message.findAll({
      where: {
        presentation_id,
      },
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: models.user,
          as: 'user',
          attributes: [['id', 'user_id'], 'full_name', 'avatar'],
        },
      ],
      order: [['id', 'DESC']],
    });
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports = {
  createNewSlideMessage,
  deleteAllPreSession,
  findByPresentationId,
};
