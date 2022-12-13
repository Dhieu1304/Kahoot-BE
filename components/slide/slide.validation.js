const Joi = require('joi');

const slide = Joi.object().keys({
  ordinal_slide_number: Joi.number().required(),
  slide_type_id: Joi.number().required(),
  title: Joi.string().default(''),
  body: Joi.array(),
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
