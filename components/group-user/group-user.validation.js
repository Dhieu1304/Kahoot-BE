const Joi = require('joi');

const changeRoleUser = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    groupId: Joi.string().required(),
    roleId: Joi.string().required(),
  }),
};

const deleteMemberGroup = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    groupId: Joi.number().integer().required(),
  }),
};

module.exports = {
  changeRoleUser,
  deleteMemberGroup,
};
