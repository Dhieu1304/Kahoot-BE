const slideParentTypeController = require('../slide-parent-type/slide-parent-type.controller');
const express = require('express');
const validate = require('../middleware/validate');
const slideController = require('./slide.controller');
const slideValidation = require('./slide.validation');
const { isHasJWT } = require('../middleware/jwt.auth');
const router = express.Router();

router.get('/type', slideParentTypeController.getAllType);
router.put('/update', validate(slideValidation.updateSlide), slideController.updateSlidePresentation);
router.post('/delete-data', validate(slideValidation.deleteSlideData), slideController.deleteSlideData);
router.get('/get-slide-data', validate(slideValidation.getSlideData), slideController.getSlideData);
router.post('/submit-answer', isHasJWT, validate(slideValidation.submitAnswer), slideController.submitAnswer);
// router.get('/get-slide', validate(slideValidation.getSlideClient), slideController.getSlideClient);

module.exports = router;
