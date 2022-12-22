const models = require('../models');

const createNewSlideQuestion = async (slideQuestionObj) => {
  try {
    return await models.slide_question.create(slideQuestionObj);
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const deleteAllPreSession = async (presentation_id) => {
  try {
    return await models.slide_question.destroy({
      where: {
        presentation_id,
      },
    });
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const upVoteQuestion = async (id, user_id) => {
  try {
    const question = await models.slide_question.findOne({ where: { id } });
    if (!question) return false;
    if (user_id) {
      const userVote = JSON.parse(question.vote_by);
      if (!userVote.includes(user_id)) {
        userVote.push(user_id);
        question.vote_by = JSON.stringify(userVote);
        question.vote += 1;
      }
    } else {
      question.vote += 1;
    }
    await question.save();
    return question;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const downVoteQuestion = async (id, user_id) => {
  try {
    const question = await models.slide_question.findOne({ where: { id } });
    if (!question) return false;
    if (user_id) {
      const userVote = JSON.parse(question.vote_by);
      const index = userVote.findIndex((userId) => userId === userId);
      if (index !== -1) userVote.splice(index, 1);
      question.vote_by = JSON.stringify(userVote);
      question.vote -= 1;
    } else {
      question.vote -= 1;
    }
    await question.save();
    return question;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const findByPresentationId = async (presentation_id, page, limit) => {
  try {
    return await models.slide_question.find({
      where: {
        presentation_id,
      },
      limit,
      offset: page * limit,
    });
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports = {
  createNewSlideQuestion,
  deleteAllPreSession,
  upVoteQuestion,
  downVoteQuestion,
  findByPresentationId,
};
