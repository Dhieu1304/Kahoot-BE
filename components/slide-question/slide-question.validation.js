const Joi = require('joi');

const newQuestion = {
  body: Joi.object().keys({
    presentation_id: Joi.number().integer(),
    code: Joi.number().integer(),
    question: Joi.string().required(),
    uid: Joi.string(),
  }),
};

const getList = {
  query: Joi.object().keys({
    presentation_id: Joi.number().integer(),
    code: Joi.number().integer(),
    uid: Joi.string(),
  }),
};

const voteQuestion = {
  body: Joi.object().keys({
    presentation_id: Joi.number().integer(),
    code: Joi.number().integer(),
    question_id: Joi.number().integer().required(),
    uid: Joi.string(),
  }),
};

const markAnswer = {
  body: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
    question_id: Joi.number().integer().required(),
  }),
};

module.exports = {
  newQuestion,
  getList,
  voteQuestion,
  markAnswer,
};
