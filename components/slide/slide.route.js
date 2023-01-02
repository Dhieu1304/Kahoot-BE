const slideParentTypeController = require('../slide-parent-type/slide-parent-type.controller');
const express = require('express');
const validate = require('../middleware/validate');
const { updateSlide, deleteSlideData } = require('./slide.validation');
const slideController = require('./slide.controller');
const router = express.Router();

router.get('/type', slideParentTypeController.getAllType);
router.put('/update', validate(updateSlide), slideController.updateSlidePresentation);
router.post('/delete-data', validate(deleteSlideData), slideController.deleteSlideData);

module.exports = router;
