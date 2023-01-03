const Joi = require('joi');

const listGroup = {
  query: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
  }),
};

const addGroup = {
  body: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
    group_id: Joi.number().integer().required(),
  }),
};

module.exports = {
  listGroup,
  addGroup,
};
