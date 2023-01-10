const { PRESENTATION_EVENT, SOCKET_EVENT } = require('./socket.constant');
const { cryptoService } = require('../service.init');
const { socketJwtAuth } = require('../middleware/jwt.auth');
const users = require('./socketUser').getInstance();
const presentations = require('./socketPresentation').getInstance();

const presentationSocket = (io, socket) => {
  socket.on(PRESENTATION_EVENT.JOIN_PRESENT_GROUP, async ({ groupId }) => {
    try {
      if (!groupId) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.join(groupId.toString());
    } catch (e) {
      console.error(e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.JOIN_HOST, async (data) => {
    try {
      console.log('================JOIN_HOST=================');
      const checkSocketJWT = await socketJwtAuth(socket);
      if (!checkSocketJWT) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid JWT Token');
      }
      if (!data.data) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const decrypted = await cryptoService.decryptData(data.data);
      if (new Date().getTime() > decrypted.date) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Expired');
      }
      if (decrypted.user_id !== socket.user.id) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid user');
      }
      socket.join(decrypted.presentation_id.toString());
      socket.join(decrypted.code.toString());
      users.userConnect(socket.id, null, socket?.user?.id, decrypted.presentation_id);
      users.logUser();
      io.in(decrypted.presentation_id.toString()).emit(
        PRESENTATION_EVENT.COUNT_ONL,
        users.countUserInRoom(decrypted.code),
      );
      socket.emit(SOCKET_EVENT.SUCCESS, `Join Successfully`);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.JOIN_CLIENT, async (data) => {
    try {
      console.log('================JOIN_CLIENT=================');
      if (!data.data) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const checkSocketJWT = await socketJwtAuth(socket);
      const decrypted = await cryptoService.decryptData(data.data);
      if (new Date().getTime() > decrypted.date) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Expired');
      }
      users.userConnect(socket.id, decrypted.code, socket?.user?.id);
      users.logUser();
      socket.join(decrypted.code.toString());
      io.in(decrypted.presentation_id.toString()).emit(
        PRESENTATION_EVENT.COUNT_ONL,
        users.countUserInRoom(decrypted.code),
      );
      socket.emit(SOCKET_EVENT.SUCCESS, `Join Successfully`);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.STOP_PRESENT, async (data) => {
    try {
      console.log('================STOP PRESENTATION=================');
      const presentation_id = +data?.presentation_id;
      if (!presentation_id) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const checkSocketJWT = await socketJwtAuth(socket);
      if (!checkSocketJWT) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid JWT Token');
      }
      const presentation = presentations.findCurrentSlideByPresentationId(presentation_id);
      socket.leave(presentation_id.toString());
      socket.leave(presentation.code.toString());
      const removePresent = presentations.removePresentation(presentation_id, socket.user.id);
      if (!removePresent) {
        return socket.emit(SOCKET_EVENT.ERROR, 'You do not have permission');
      }
      io.in(presentation.code.toString()).emit(PRESENTATION_EVENT.SLIDE, 'The host is stop slideshow');
      io.in(presentation_id.toString()).emit(PRESENTATION_EVENT.STOP_PRESENT, 'The host is stop slideshow');
      console.log('TOTAL SLIDE IS PRESENT: ', presentations.getTotalPresent());
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });
};

module.exports = presentationSocket;
