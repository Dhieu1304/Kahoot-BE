const Joi = require('joi');

const newMessage = {
  body: Joi.object().keys({
    presentation_id: Joi.number().integer(),
    code: Joi.number().integer(),
    message: Joi.string().required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    presentation_id: Joi.number().integer(),
    code: Joi.number().integer(),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10),
  }),
};

module.exports = {
  newMessage,
  getList,
};
