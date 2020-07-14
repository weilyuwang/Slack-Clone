function joinRoom(roomName) {
  // send this roomName to the server!
  // Only server can manage the room
  nsSocket.emit("joinRoom", roomName, () => {
    // We want to update the room member total now that we have joined
  });
}
