const { SOCKET_EVENT, QUESTION_EVENT } = require('./socket.constant');
const { slideQuestionService } = require('../service.init');
const presentations = require('./socketPresentation').getInstance();

const questionSocket = (io, socket) => {
  try {
    socket.on(QUESTION_EVENT.QUESTION, async (data) => {
      const code = +data?.code;
      const question = data?.question;
      const user_id = data?.user_id;
      if (!code || !question) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const presentation = presentations.findCurrentSlideByCode(code);
      if (!presentation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid presentation');
      }
      const newQuestion = await slideQuestionService.createNewSlideQuestion({
        presentation_id: presentation.presentation_id,
        question,
        user_id,
      });
      if (!newQuestion) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Internal Error Server');
      }
      return io.in(code.toString()).emit(QUESTION_EVENT.QUESTION, question);
    });

    socket.on(QUESTION_EVENT.UP_VOTE, async (data) => {
      const id = +data?.id;
      const code = +data?.code;
      const user_id = data?.user_id;
      if (!id) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const upVote = await slideQuestionService.upVoteQuestion(id, user_id);
      if (!upVote) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Internal Error Server');
      }
      upVote.vote_by = JSON.parse(upVote.vote_by);
      io.in(code.toString()).emit(QUESTION_EVENT.VOTE, upVote);
    });

    socket.on(QUESTION_EVENT.DOWN_VOTE, async (data) => {
      const id = +data?.id;
      const code = +data?.code;
      const user_id = data?.user_id;
      if (!id) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const downVote = await slideQuestionService.downVoteQuestion(id, user_id);
      if (!downVote) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Internal Error Server');
      }
      downVote.vote_by = JSON.parse(downVote.vote_by);
      io.in(code.toString()).emit(QUESTION_EVENT.VOTE, downVote);
    });
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = questionSocket;
