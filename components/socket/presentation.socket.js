const { PRESENTATION_EVENT, SOCKET_EVENT } = require('./socket.constant');
const { slideService, presentationService } = require('../service.init');
const users = require('./socketUser').getInstance();
const presentations = require('./socketPresentation').getInstance();

const presentationSocket = (io, socket) => {
  try {
    socket.on(PRESENTATION_EVENT.JOIN, async (data) => {
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.join(code.toString());
      const slide = presentations.findCurrentSlideByCode(code);
      if (!slide) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Please wait the host present this slide');
      }
      users.userConnect(socket.id, code);
      const slideDetail = await slideService.findOneSlide(slide.presentation_id, slide.ordinal_slide_number);
      socket.emit(PRESENTATION_EVENT.SLIDE, slideDetail);
      io.in(code).emit(PRESENTATION_EVENT.COUNT_ONL, users.countUserInRoom().length);
    });

    socket.on(PRESENTATION_EVENT.LEAVE, (data) => {
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.leave(code);
    });

    socket.on(PRESENTATION_EVENT.PRESENT, async (data) => {
      console.error('-------------------PRESENT----------------------------------', data);
      const presentation_id = +data?.presentation_id;
      const ordinal_slide_number = +data?.ordinal_slide_number;
      const presentation = await presentationService.findOneById(presentation_id);
      const code = +presentation?.code;
      if (!presentation_id || !ordinal_slide_number || !code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      presentations.addPresentation(presentation_id, code, ordinal_slide_number);
      const slideDetail = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
      io.in(code.toString()).emit(PRESENTATION_EVENT.SLIDE, slideDetail);
      socket.emit(SOCKET_EVENT.SUCCESS, `Present successful with slide ${ordinal_slide_number}`);
    });

    socket.on(PRESENTATION_EVENT.STOP_PRESENT, (data) => {
      const presentation_id = +data?.presentation_id;
      if (!presentation_id) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const presentation = presentations.findCurrentSlideByPresentationId(presentation_id);
      presentations.removePresentation(presentation_id);
      io.in(presentation.code.toString()).emit(PRESENTATION_EVENT.SLIDE, 'The host is stop slideshow');
    });
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = presentationSocket;
