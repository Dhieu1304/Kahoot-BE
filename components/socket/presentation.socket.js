const { PRESENTATION_EVENT, SOCKET_EVENT } = require('./socket.constant');
const { slideService } = require('../service.init');
const users = require('./socketUser').getInstance();
const presentations = require('./socketPresentation').getInstance();

const presentationSocket = (io, socket) => {
  try {
    socket.on(PRESENTATION_EVENT.JOIN, async (data) => {
      const code = data?.code?.toString();
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const slide = presentations.findCurrentSlideByCode(code);
      if (!slide) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Please wait the host present this slide');
      }
      socket.join(code);
      users.userConnect(socket.id, code);
      const slideDetail = await slideService.findOneSlide(slide.presentation_id, slide.ordinal_slide_number);
      socket.emit(PRESENTATION_EVENT.SLIDE, slideDetail);
      io.in(code).emit(PRESENTATION_EVENT.COUNT_ONL, users.countUserInRoom());
    });

    socket.on(PRESENTATION_EVENT.LEAVE, (data) => {
      const code = data.code.toString();
      socket.leave(code);
    });
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = presentationSocket;
