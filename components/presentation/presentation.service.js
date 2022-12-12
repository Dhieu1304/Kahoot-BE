const models = require('../models');

const findOneById = async (id) => {
  try {
    return await models.presentation.findOne({ where: { id: id } });
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

module.exports = {
  findOneById,
  createNewPresentation,
};
