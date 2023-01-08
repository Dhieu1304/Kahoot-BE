const socketUser = (function () {
  let instance = null;
  function init() {
    const currentUsers = [];
    return {
      userConnect: function (id, code, user_id, presentation_id = null) {
        const index = currentUsers.findIndex((user) => user.id === id);
        if (index === -1) {
          currentUsers.push({ id, code, user_id, presentation_id });
        }
      },
      getCurrentUser: function () {
        return currentUsers;
      },
      countUserInRoom: function (code) {
        let result = 0;
        for (let i = 0; i < currentUsers.length; i++) {
          if (currentUsers[i].code === code) {
            result++;
          }
        }
        return result;
      },
      userDisconnect: function (id) {
        const index = currentUsers.findIndex((user) => user.id === id);
        if (index !== -1) {
          currentUsers.splice(index, 1);
        }
      },
      findCurrentUserBySocketId: function (id) {
        const result = currentUsers.find((user) => user.id === id);
        return Object.assign({}, result);
      },
      logUser: function () {
        console.log('User Length: ', currentUsers.length);
        console.log(currentUsers);
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) instance = init();
      return instance;
    },
  };
})();

module.exports = socketUser;
