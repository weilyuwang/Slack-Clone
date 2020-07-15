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
    nsSocket.on("joinRoom", (roomName, numberOfUsersCallback) => {
      // deal with history... once we have it
      nsSocket.join(roomName);
      io.of("/wiki")
        .in(roomName)
        .clients((error, clients) => {
          numberOfUsersCallback(clients.length);
        });
    });
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "dumbuser",
        avatar: "https://via.placeholder.com/30",
      };
      console.log(fullMsg);
      // send this message to all the sockets that are in the room
      // THAT this socket is in
      // the user will be in the 2nd room in the object list
      // this is because the socket ALWAYS joins its own room on connection
      // get the keys
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      io.of("/wiki").to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});
