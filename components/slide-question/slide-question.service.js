const models = require('../models');

const createNewSlideQuestion = async (presentation_id, question, user_id, uid) => {
  try {
    return await models.slide_question.create({ presentation_id, question, user_id, uid });
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
    const userVote = question.vote_by ? JSON.parse(question.vote_by) : [];
    if (userVote.includes(user_id)) {
      return false;
    }
    userVote.push(user_id);
    console.log(userVote);
    question.vote_by = JSON.stringify(userVote);
    question.vote += 1;
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
    const userVote = question.vote_by ? JSON.parse(question.vote_by) : [];
    if (!userVote.includes(user_id)) {
      return false;
    }
    const index = userVote.findIndex((userId) => userId === userId);
    if (index !== -1) userVote.splice(index, 1);
    question.vote_by = JSON.stringify(userVote);
    question.vote -= 1;
    await question.save();
    return question;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

const findByPresentationId = async (presentation_id) => {
  try {
    return await models.slide_question.findAll({
      where: { presentation_id },
      include: [
        {
          model: models.user,
          as: 'user',
          attributes: [['id', 'user_id'], 'full_name', 'avatar'],
        },
      ],
      order: [['id', 'DESC']],
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
