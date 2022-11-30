const { Server } = require("socket.io");
let io;

const init = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  return io;
};

const update = (table) => {
  io?.sockets.emit("update-table", table);
};


module.exports = { init };
module.exports.update = update;
