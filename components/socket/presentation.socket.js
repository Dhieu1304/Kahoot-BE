const { PRESENTATION_EVENT, SOCKET_EVENT, CHAT_EVENT, QUESTION_EVENT } = require('./socket.constant');
const {
  slideService,
  presentationService,
  slideDataService,
  presentationMemberService,
  cryptoService,
} = require('../service.init');
const { socketJwtAuth } = require('../middleware/jwt.auth');
const convertDataSlide = require('../utils/convertDataSlide');
const users = require('./socketUser').getInstance();
const presentations = require('./socketPresentation').getInstance();

const presentationSocket = (io, socket) => {
  /*socket.on(PRESENTATION_EVENT.JOIN, async (data) => {
    try {
      console.log('================JOIN PRESENTATION=================');
      const code = +data?.code;
      if (!code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      const presentation = await presentationService.findOneByCode(code);
      if (!presentation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid code');
      }
      if (presentation && presentation?.presentation_type_id === 2) {
        const checkSocketJWT = await socketJwtAuth(socket);
        if (!checkSocketJWT) {
          return socket.emit(SOCKET_EVENT.ERROR, 'Invalid JWT Token');
        }
        // todo check user in group
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
  });*/

  /*socket.on(PRESENTATION_EVENT.LEAVE, (data) => {
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
  });*/

  /*
  socket.on(PRESENTATION_EVENT.PRESENT, async (data) => {
    try {
      console.log('================PRESENT PRESENTATION=================');
      const checkSocketJWT = await socketJwtAuth(socket);
      if (!checkSocketJWT) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid JWT Token');
      }
      const presentation_id = +data?.presentation_id;
      const presentation = await presentationService.findOneById(presentation_id);
      if (!presentation) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid presentation');
      }
      const checkUserPermission = await presentationMemberService.checkCanEdit(socket.user.id, presentation_id);
      if (!checkUserPermission) {
        return socket.emit(SOCKET_EVENT.ERROR, 'You do not have permission');
      }
      const code = +presentation?.code;
      if (!presentation_id || !code) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      socket.join(presentation_id.toString());
      socket.join(code.toString());
      let ordinal_slide_number;
      const presentSocket = presentations.findCurrentSlideByCode(code);
      let slide;
      if (!presentSocket) {
        ordinal_slide_number = 1;
        presentations.addPresentation(
          presentation_id,
          code,
          ordinal_slide_number,
          presentation.presentation_type_id,
          socket.user.id,
        );
      } else {
        ordinal_slide_number = presentSocket.ordinal_slide_number;
      }
      slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
      if (!presentSocket) {
        io.in(code.toString()).emit(PRESENTATION_EVENT.SLIDE, slide);
      }
      const count_slide = await slideService.countSlidePresentation(presentation_id);
      socket.emit(PRESENTATION_EVENT.SLIDE_DETAIL, {
        user_id: presentSocket.user_id || socket.user.id,
        type: presentation.presentation_type_id,
        count_slide,
      });
      // get slide data
      if (slide && slide.slide_type_id === 1) {
        const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
        convertDataSlide(slide.body, dataCount);
        socket.emit(PRESENTATION_EVENT.SLIDE_DATA, slide);
      }
      // message presentation
      // const message = await slideMessageService.findByPresentationId(presentation_id, 1, 50);
      // socket.emit(CHAT_EVENT.MESSAGE, message);
      // question presentation
      // const question = await slideQuestionService.findByPresentationId(presentation_id, 1, 50);
      // socket.emit(QUESTION_EVENT.QUESTION, question);
      socket.emit(SOCKET_EVENT.SUCCESS, `Present successful with slide ${ordinal_slide_number}`);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });
*/

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
      const decrypted = await cryptoService.decryptData(data.data);
      if (new Date().getTime() > decrypted.date) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Expired');
      }
      users.userConnect(socket.id, decrypted.code);
      socket.join(decrypted.code.toString());
      socket.emit(SOCKET_EVENT.SUCCESS, `Join Successfully`);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });

  /*socket.on(PRESENTATION_EVENT.PRESENT_OTHER_SLIDE, async (data) => {
    console.log('================PRESENT OTHER SLIDE=================');
    const checkSocketJWT = await socketJwtAuth(socket);
    if (!checkSocketJWT) {
      return socket.emit(SOCKET_EVENT.ERROR, 'Invalid JWT Token');
    }
    const presentation_id = +data?.presentation_id;
    const ordinal_slide_number = +data?.ordinal_slide_number;
    if (!presentation_id || !ordinal_slide_number) {
      return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
    }
    const checkUserPermission = await presentationMemberService.checkCanEdit(socket.user.id, presentation_id);
    if (!checkUserPermission) {
      return socket.emit(SOCKET_EVENT.ERROR, 'You do not have permission');
    }
    const presentSocket = presentations.findCurrentSlideByPresentationId(presentation_id);
    if (!presentSocket) {
      return socket.emit(SOCKET_EVENT.ERROR, 'Presentation is not present');
    }
    presentations.addPresentation(presentation_id, presentSocket.code, ordinal_slide_number);
    const slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
    io.in(presentSocket.code.toString()).emit(PRESENTATION_EVENT.SLIDE, slide);
    // get slide data
    if (slide && slide.slide_type_id === 1) {
      const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
      convertDataSlide(slide.body, dataCount);
    }
    io.in(presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, slide);
    socket.emit(SOCKET_EVENT.SUCCESS, `Change to slide ${ordinal_slide_number}`);
    try {
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });*/

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
      if (presentation.type === 2) {
        const checkSocketJWT = await socketJwtAuth(socket);
        if (!checkSocketJWT) {
          return socket.emit(SOCKET_EVENT.ERROR, 'Invalid JWT Token');
        }
        // todo check user in group
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

  /*socket.on(CHAT_EVENT.GET_MESSAGE, async (data) => {
    try {
      console.log('================GET MESSAGE=================');
      const presentation_id = +data?.presentation_id;
      const page = +data?.page;
      const limit = +data?.limit;
      if (!presentation_id || !page || !limit) {
        return socket.emit(SOCKET_EVENT.ERROR, 'Invalid Input');
      }
      // const message = await slideMessageService.findByPresentationId(presentation_id, page, limit);
      // socket.emit(CHAT_EVENT.GET_MESSAGE, message);
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
      const question = await slideQuestionService.findByPresentationId(presentation_id, page, limit);
      socket.emit(QUESTION_EVENT.QUESTION, question);
    } catch (e) {
      console.error(e.message);
      socket.emit(SOCKET_EVENT.ERROR, e.message);
    }
  });*/
};

module.exports = presentationSocket;
