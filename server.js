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
      const nsRoom = namespaces[0].rooms.find((room) => {
        return room.roomTitle === roomName;
      });
      nsSocket.emit("historyCatchUp", nsRoom.history);
    });

    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "dumbuser",
        avatar: "https://via.placeholder.com/30",
      };

      // send this message to all the sockets that are in the room
      // THAT this socket is in
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      const nsRoom = namespaces[0].rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      nsRoom.addMessage(fullMsg); // add msg to history array of this room
      io.of("/wiki").to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});
