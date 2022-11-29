const Joi = require('joi');

const joinGroupByLink = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const createInviteLink = {
  query: Joi.object().keys({
    groupId: Joi.string().required(),
  }),
};

const inviteUser = {
  query: Joi.object().keys({
    email: Joi.string().required().email(),
    groupId: Joi.string().required(),
  }),
};

module.exports = {
  joinGroupByLink,
  createInviteLink,
  inviteUser,
};
