const Joi = require('joi');

const bodySlide = Joi.object().keys({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const slide = Joi.object().keys({
  ordinal_slide_number: Joi.number().integer().required(),
  slide_type_id: Joi.number().integer().required(),
  title: Joi.string().default(null).allow('', null),
  body: Joi.array().items(bodySlide).default(null).allow('', null),
  description: Joi.string().default(null).allow('', null),
});

const updateSlide = {
  body: Joi.object().keys({
    presentation_id: Joi.number().required(),
    data: Joi.array().required().items(slide),
  }),
};

module.exports = {
  updateSlide,
};
