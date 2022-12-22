const { PRESENTATION_EVENT, SOCKET_EVENT, CHAT_EVENT, QUESTION_EVENT } = require('./socket.constant');
const {
  slideService,
  presentationService,
  slideDataService,
  slideMessageService,
  slideQuestionService,
} = require('../service.init');
const users = require('./socketUser').getInstance();
const presentations = require('./socketPresentation').getInstance();

const presentationSocket = (io, socket) => {
  try {
    socket.on(PRESENTATION_EVENT.JOIN, async (data) => {
      console.log('================JOIN PRESENTATION=================');
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const slide = presentations.findCurrentSlideByCode(code);
      if (!slide) {
        return socket.emit(PRESENTATION_EVENT.SLIDE, 'Please wait the host present this slide');
      }
      socket.join(code.toString());
      users.userConnect(socket.id, code);
      const slideDetail = await slideService.findOneSlide(slide.presentation_id, slide.ordinal_slide_number);
      socket.emit(PRESENTATION_EVENT.SLIDE, slideDetail);
      io.in(slide.presentation_id.toString()).emit(PRESENTATION_EVENT.COUNT_ONL, users.countUserInRoom());
    });

    socket.on(PRESENTATION_EVENT.LEAVE, (data) => {
      console.log('================LEAVE PRESENTATION=================');
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.leave(code);
    });

    socket.on(PRESENTATION_EVENT.PRESENT, async (data) => {
      const presentation_id = +data?.presentation_id;
      const ordinal_slide_number = +data?.ordinal_slide_number;
      const presentation = await presentationService.findOneById(presentation_id);
      if (!presentation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid presentation');
      }
      const code = +presentation?.code;
      if (!presentation_id || !ordinal_slide_number || !code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.join(presentation_id.toString());
      socket.join(code.toString());
      presentations.addPresentation(presentation_id, code, ordinal_slide_number);
      const slideDetail = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
      // present slide
      io.in(presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE, slideDetail);
      // get slide data
      const dataCount = await slideService.dataCountSlide(
        presentation.presentation_id,
        presentation.ordinal_slide_number,
      );
      io.in(presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, dataCount);
      // message presentation
      const message = await slideMessageService.findByPresentationId(presentation_id, 1, 50);
      io.in(code.toString()).emit(CHAT_EVENT.MESSAGE, message);
      // question presentation
      const question = await slideQuestionService.findByPresentationId(presentation_id, 1, 50); //
      io.in(code.toString()).emit(QUESTION_EVENT.QUESTION, question);
      socket.emit(SOCKET_EVENT.SUCCESS, `Present successful with slide ${ordinal_slide_number}`);
    });

    socket.on(PRESENTATION_EVENT.STOP_PRESENT, (data) => {
      const presentation_id = +data?.presentation_id;
      const user_id = +data?.user_id;
      if (!presentation_id || !user_id) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const removePresent = presentations.removePresentation(presentation_id, user_id);
      if (!removePresent) {
        return socket.emit(SOCKET_EVENT.ERROR, 'You do not have permission');
      }
      io.in(presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE, 'The host is stop slideshow');
    });

    socket.on(PRESENTATION_EVENT.SUBMIT_ANSWER, async (data) => {
      const code = +data?.code;
      const name = data?.name;
      if (!code || !name) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const presentation = presentations.findCurrentSlideByCode(code);
      if (!presentation) {
        socket.emit(SOCKET_EVENT.ERROR, 'Invalid presentation');
      }
      await slideDataService.createNewSlideData({
        presentation_id: presentation.presentation_id,
        ordinal_slide_number: presentation.ordinal_slide_number,
        name,
        value: 1,
      });
      const dataCount = await slideService.dataCountSlide(
        presentation.presentation_id,
        presentation.ordinal_slide_number,
      );
      io.in(presentation.presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, dataCount);
    });

    socket.on(PRESENTATION_EVENT.SLIDE_DATA, async (data) => {
      const presentation_id = +data.presentation_id;
      const ordinal_slide_number = +data.ordinal_slide_number;
      if (!presentation_id || !ordinal_slide_number) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
      io.in(presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, dataCount);
    });

    socket.on(CHAT_EVENT.GET_MESSAGE, async (data) => {
      const presentation_id = +data?.presentation_id;
      const page = +data?.page;
      const limit = +data?.limit;
      if (!presentation_id || !page || !limit) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const message = await slideMessageService.findByPresentationId(presentation_id, page, limit);
      socket.emit(CHAT_EVENT.GET_MESSAGE, message);
    });

    socket.on(QUESTION_EVENT.GET_QUESTION, async (data) => {
      const presentation_id = +data?.presentation_id;
      const page = +data?.page;
      const limit = +data?.limit;
      if (!presentation_id || !page || !limit) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const question = await slideQuestionService.findByPresentationId(presentation_id, page, limit); //
      socket.emit(QUESTION_EVENT.QUESTION, question);
    });
  } catch (e) {
    console.error(e.message);
    socket.emit(SOCKET_EVENT.ERROR, e.message);
  }
};

module.exports = presentationSocket;
