const Joi = require('joi');

const listMember = {
  query: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
  }),
};

const addCoOwner = {
  body: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
    email: Joi.string().email().required(),
  }),
};

module.exports = {
  listMember,
  addCoOwner,
};
