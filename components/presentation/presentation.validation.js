const Joi = require('joi');
const { PRESENTATION_TYPE } = require('../presentation-type/presentation-type.constant');

const listPresentation = {
  query: Joi.object().keys({
    limit: Joi.number().default(10),
    page: Joi.number().default(0),
  }),
};

const createPresentation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().valid(...Object.values(PRESENTATION_TYPE)),
    themeId: Joi.number().default(1),
  }),
};

const editPresentation = {
  body: Joi.object().keys({
    presentationId: Joi.number().required(),
    name: Joi.string(),
    presentation_type_id: Joi.number().integer(),
    presentation_theme_id: Joi.number().integer(),
  }),
};

const presentationDetail = {
  param: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const deletePresentation = {
  param: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
  }),
};

const deleteSession = {
  param: Joi.object().keys({
    presentation_id: Joi.number().integer().required(),
  }),
};

module.exports = {
  listPresentation,
  createPresentation,
  editPresentation,
  presentationDetail,
  deletePresentation,
  deleteSession,
};
