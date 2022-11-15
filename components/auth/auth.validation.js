const { ROLE } = require('../role/role.constant');
const Joi = require('joi');

// prevent create admin account
delete ROLE.ADMIN;

module.exports.registerValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLE)),
  }),
};

module.exports.loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};
