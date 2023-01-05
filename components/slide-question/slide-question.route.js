const slideQuestionValidation = require('./slide-question.validation');
const slideQuestionController = require('./slide-question.controller');
const express = require('express');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');
const router = express.Router();

router.get('/list-question', validate(slideQuestionValidation.getList), slideQuestionController.getListQuestion);
router.post('/new-question', validate(slideQuestionValidation.newQuestion), slideQuestionController.newQuestion);
router.post(
  '/up-vote-question',
  validate(slideQuestionValidation.voteQuestion),
  slideQuestionController.upVoteQuestion,
);
router.post(
  '/down-vote-question',
  validate(slideQuestionValidation.voteQuestion),
  slideQuestionController.downVoteQuestion,
);

module.exports = router;
