const express = require("express");
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");
console.log(namespaces);

const app = express();
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

// main namespace
io.of("/").on("connect", (socket) => {
  // Send an event from the server to this socket only:
  socket.emit("messageFromServer", { data: "Welcome to the socket.io server" });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.join("level1");

  /*
    socket.to => send to everybody in the room except self
    io.to => sent by server, so everybody in the room including self can see the message
  */

  socket
    .to("level1")
    .emit("joined", `${socket.id} says I have joined the level 1 room`);
  // io.of("/")
  //   .to("level1")
  //   .emit("joined", `${socket.id} says I have joined the level 1 room`);
});

// /admin namespace
io.of("/admin").on("connect", (socket) => {
  console.log("Someone connected to the admin namespace");

  //send a message to the entire namespace
  io.of("/admin").emit("welcome", "Welcome to the admin channel!");
});
