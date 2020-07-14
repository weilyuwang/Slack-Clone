const express = require("express");
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");

const app = express();
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// main namespace
io.of("/").on("connect", (socket) => {
  // build an array to send back with the image and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // send nsData back to client. We need to use socket not io
  // because we want it to go to just this client
  socket.emit("nsList", nsData);
});

// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on("connect", (nsSocket) => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our chat group namesapces
    // send that ns group info back to client
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
  });
});
