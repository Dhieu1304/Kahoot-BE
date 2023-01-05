const slideQuestionValidation = require('./slide-question.validation');
const slideQuestionController = require('./slide-question.controller');
const express = require('express');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');
const router = express.Router();

router.get('/list-question', validate(slideQuestionValidation.getList), slideQuestionController.getListQuestion);
router.post('/new-Question', validate(slideQuestionValidation.newQuestion), slideQuestionController.newQuestion);

module.exports = router;
