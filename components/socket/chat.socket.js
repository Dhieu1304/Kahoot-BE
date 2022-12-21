const { SOCKET_EVENT, CHAT_EVENT } = require('./socket.constant');
const { slideMessageService } = require('../service.init');
const presentations = require('./socketPresentation').getInstance();

const chatSocket = (io, socket) => {
  try {
    socket.on(CHAT_EVENT.MESSAGE, async (data) => {
      const code = +data?.code;
      const message = data?.message;
      const user_id = data?.user_id;
      if (!code || !message) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const presentation = presentations.findCurrentSlideByCode(code);
      if (!presentation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid presentation');
      }
      const newMessage = await slideMessageService.createNewSlideMessage({
        presentation_id: presentation.presentation_id,
        message,
        user_id,
      });
      if (!newMessage) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Internal Error Server');
      }
      io.in(code.toString()).emit(CHAT_EVENT.MESSAGE, message);
    });
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = chatSocket;
