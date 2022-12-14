const socketUser = (function () {
  let instance = null;
  function init() {
    const currentUsers = [];
    return {
      userConnect: function (id, code) {
        currentUsers.push({ id, code });
      },
      getCurrentUser: function () {
        return currentUsers;
      },
      countUserInRoom: function (code) {
        let result = 0;
        for (let i = 0; i < currentUsers.length; i++) {
          if (currentUsers.code === code) {
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
        return currentUsers.find((user) => user.id === id);
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
