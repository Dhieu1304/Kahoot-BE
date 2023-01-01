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

const convertDataSlide = (bodySlide, data) => {
  if (data && data.length > 0) {
    for (let i = 0; i < bodySlide.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (bodySlide[i].name === data[j].name) {
          bodySlide[i].value = data[j].count;
        }
      }
    }
  } else {
    for (let i = 0; i < bodySlide.length; i++) {
      bodySlide[i].value = 0;
    }
  }
};

const presentationSocket = (io, socket) => {
  socket.on(PRESENTATION_EVENT.JOIN, async (data) => {
    try {
      console.log('================JOIN PRESENTATION=================');
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      users.userConnect(socket.id, code);
      socket.join(code.toString());
      const slide = presentations.findCurrentSlideByCode(code);
      if (!slide) {
        return socket.emit(PRESENTATION_EVENT.SLIDE, 'Please wait the host present this slide');
      }
      const slideDetail = await slideService.findOneSlide(slide.presentation_id, slide.ordinal_slide_number);
      socket.emit(PRESENTATION_EVENT.SLIDE, slideDetail);
      io.in(slide.presentation_id.toString()).emit(PRESENTATION_EVENT.COUNT_ONL, users.countUserInRoom(code));
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.LEAVE, (data) => {
    try {
      console.log('================LEAVE PRESENTATION=================');
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.leave(code);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.PRESENT, async (data) => {
    try {
      console.log('================PRESENT PRESENTATION=================');
      // Todo, check user present
      const presentation_id = +data?.presentation_id;
      const presentation = await presentationService.findOneById(presentation_id);
      if (!presentation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid presentation');
      }
      const code = +presentation?.code;
      if (!presentation_id || !code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.join(presentation_id.toString());
      socket.join(code.toString());
      let ordinal_slide_number = 0;
      const presentSocket = presentations.findCurrentSlideByCode(code);
      let slide;
      if (!presentSocket) {
        ordinal_slide_number = 1;
        // todo add user is present
        presentations.addPresentation(presentation_id, code, ordinal_slide_number, 1, '1');
      } else {
        ordinal_slide_number = presentSocket.ordinal_slide_number;
      }
      slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
      if (!presentSocket) {
        console.log(' >>>>>>>>>>>>>>>>>>> emit to client');
        console.log(code);
        io.in(code.toString()).emit(PRESENTATION_EVENT.SLIDE, slide);
      }
      socket.emit(PRESENTATION_EVENT.SLIDE_DETAIL, { ordinal_slide_number, user_id: 1, user_name: '1' });
      // get slide data
      if (slide && slide.slide_type_id === 1) {
        const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
        convertDataSlide(slide.body, dataCount);
        socket.emit(PRESENTATION_EVENT.SLIDE_DATA, slide);
      }
      // message presentation
      const message = await slideMessageService.findByPresentationId(presentation_id, 1, 50);
      // io.in(code.toString()).emit(CHAT_EVENT.MESSAGE, message);
      socket.emit(CHAT_EVENT.MESSAGE, message);
      // question presentation
      const question = await slideQuestionService.findByPresentationId(presentation_id, 1, 50);
      // io.in(code.toString()).emit(QUESTION_EVENT.QUESTION, question);
      socket.emit(QUESTION_EVENT.QUESTION, question);
      socket.emit(SOCKET_EVENT.SUCCESS, `Present successful with slide ${ordinal_slide_number}`);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.PRESENT_OTHER_SLIDE, async (data) => {
    console.log('================PRESENT OTHER SLIDE=================');

    // Todo
    try {
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.STOP_PRESENT, (data) => {
    try {
      console.log('================STOP PRESENTATION=================');
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
      console.log('TOTAL SLIDE IS PRESENT: ', presentations.getTotalPresent());
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(PRESENTATION_EVENT.SUBMIT_ANSWER, async (data) => {
    try {
      console.log('================SUBMIT ANSWER=================');
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
      const slide = await slideService.findOneSlide(presentation.presentation_id, presentation.ordinal_slide_number);
      if (slide.slide_type_id === 1) {
        const dataCount = await slideService.dataCountSlide(
          presentation.presentation_id,
          presentation.ordinal_slide_number,
        );
        convertDataSlide(slide.body, dataCount);
      }
      io.in(presentation.presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, slide);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(CHAT_EVENT.GET_MESSAGE, async (data) => {
    try {
      console.log('================GET MESSAGE=================');
      const presentation_id = +data?.presentation_id;
      const page = +data?.page;
      const limit = +data?.limit;
      if (!presentation_id || !page || !limit) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const message = await slideMessageService.findByPresentationId(presentation_id, page, limit);
      socket.emit(CHAT_EVENT.GET_MESSAGE, message);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  socket.on(QUESTION_EVENT.GET_QUESTION, async (data) => {
    try {
      console.log('================GET QUESTION=================');
      const presentation_id = +data?.presentation_id;
      const page = +data?.page;
      const limit = +data?.limit;
      if (!presentation_id || !page || !limit) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const question = await slideQuestionService.findByPresentationId(presentation_id, page, limit); //
      socket.emit(QUESTION_EVENT.QUESTION, question);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });
};

module.exports = presentationSocket;
