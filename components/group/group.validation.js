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

module.exports = {
  joinGroupByLink,
  createInviteLink,
};
