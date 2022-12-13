const socketUser = (function () {
  let instance = null;
  function init() {
    const currentUsers = [];
    return {
      userConnect: function (id) {
        currentUsers.push(id);
      },
      getCurrentUser: function () {
        return currentUsers;
      },
      userDisconnect: function (id) {
        const index = currentUsers.findIndex((socketId) => socketId === id);
        if (index !== -1) {
          currentUsers.splice(index, 1);
        }
      },
      findCurrentUserBySocketId: function (id) {
        return currentUsers.find((socketId) => socketId === id);
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
