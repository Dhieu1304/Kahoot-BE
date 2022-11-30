const Joi = require('joi');

const updateInfo = {
  body: Joi.object().keys({
    avatar: Joi.string(),
    full_name: Joi.string(),
  }),
};

module.exports = {
  updateInfo,
};
