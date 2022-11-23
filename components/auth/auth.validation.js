const Joi = require('joi');

module.exports.registerValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    avatar: Joi.string(),
  }),
};

module.exports.googleAuth = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    avatar: Joi.string(),
  }),
};

module.exports.loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports.verifyEmailValidate = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports.refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
