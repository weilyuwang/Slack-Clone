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

// Loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  // When a socket has connected to one of the namesapces
  io.of(namespace.endpoint).on("connect", (nsSocket) => {
    // Note that the handshake only happends once -
    // So you can use the same username is every namespace or room
    const username = nsSocket.handshake.query.username;

    // send that namespace rooms info to client
    nsSocket.emit("nsRoomLoad", namespace.rooms);

    // Whenver a new user joined
    nsSocket.on("joinRoom", (roomToJoin) => {
      // Leave the current room the user is in
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);

      // Join the new room
      nsSocket.join(roomToJoin);
      updateUsersInRoom(namespace, roomToJoin);

      // Load the history messages in the new room
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });
      nsSocket.emit("historyCatchUp", nsRoom.history);
    });

    // When a socket/user sends out a message
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: "https://via.placeholder.com/30",
      };

      // Send this message to all the sockets/users that are in the room
      // THAT this socket/user is in
      const roomName = Object.keys(nsSocket.rooms)[1];
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomName;
      });

      // add msg to history array of this room
      nsRoom.addMessage(fullMsg);

      // Send out user messages to the whole room
      io.of(namespace.endpoint).to(roomName).emit("messageToClients", fullMsg);
    });
  });
});

// send back the number of users in roomName to
// ALL sockets connected to roomName
function updateUsersInRoom(namespace, roomName) {
  io.of(namespace.endpoint)
    .in(roomName)
    .clients((error, clients) => {
      io.of(namespace.endpoint)
        .in(roomName)
        .emit("updateMembers", clients.length);
    });
}
