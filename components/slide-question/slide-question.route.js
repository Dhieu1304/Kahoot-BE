const slideQuestionValidation = require('./slide-question.validation');
const slideQuestionController = require('./slide-question.controller');
const express = require('express');
const validate = require('../middleware/validate');
const { jwtAuth, isHasJWT } = require('../middleware/jwt.auth');
const router = express.Router();

router.get(
  '/list-question',
  isHasJWT,
  validate(slideQuestionValidation.getList),
  slideQuestionController.getListQuestion,
);
router.post(
  '/new-question',
  isHasJWT,
  validate(slideQuestionValidation.newQuestion),
  slideQuestionController.newQuestion,
);
router.post(
  '/up-vote-question',
  isHasJWT,
  validate(slideQuestionValidation.voteQuestion),
  slideQuestionController.upVoteQuestion,
);
router.post(
  '/down-vote-question',
  isHasJWT,
  validate(slideQuestionValidation.voteQuestion),
  slideQuestionController.downVoteQuestion,
);
router.post(
  '/mark-answer',
  jwtAuth,
  validate(slideQuestionValidation.markAnswer),
  slideQuestionController.markAnswerQuestion,
);

module.exports = router;
