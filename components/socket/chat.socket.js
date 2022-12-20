const { SOCKET_EVENT } = require('./socket.constant');

const chatSocket = (io, socket) => {
  try {
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = chatSocket;
