const Joi = require('joi');

const changeRoleUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    groupId: Joi.string().required(),
    roleId: Joi.string().required(),
  }),
};

module.exports = {
  changeRoleUser,
};
