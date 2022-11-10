const { ROLE } = require("../user/user.constant");
const Joi = require('joi');

module.exports.registerValidate = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        role: Joi.string().valid(ROLE.STUDENT, ROLE.TEACHER),
    }),
};

module.exports.loginValidate = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
};
