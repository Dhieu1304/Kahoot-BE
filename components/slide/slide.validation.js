const Joi = require('joi');

const bodySlide = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

const slide = Joi.object().keys({
  ordinal_slide_number: Joi.number().required(),
  slide_type_id: Joi.number().required(),
  title: Joi.string().default(''),
  body: Joi.array().items(bodySlide),
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
