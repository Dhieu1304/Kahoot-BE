const { ROLE } = require('../role/role.constant');
const Joi = require('joi');

// prevent admin role
const userRole = Object.values(ROLE);
userRole.pop();

module.exports.registerValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().valid(...userRole),
  }),
};

module.exports.loginValidate = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};
