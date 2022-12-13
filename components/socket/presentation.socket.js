const { PRESENTATION_EVENT, SOCKET_EVENT } = require('./socket.constant');
const users = require('./socketUser').getInstance();

const presentationSocket = (io, socket) => {
  try {
    socket.on(PRESENTATION_EVENT.JOIN, (data) => {
      socket.join(data.code.toString());
      socket.emit(SOCKET_EVENT.SUCCESS, 'Join successful');
    });
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = presentationSocket;
