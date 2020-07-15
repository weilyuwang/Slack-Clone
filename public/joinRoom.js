function joinRoom(roomName) {
  // send this roomName to the server!
  // Only server can manage the room
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    // We want to update the room member total now that we have joined
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span
    >`;
  });
  nsSocket.on("historyCatchUp", (history) => {
    const messageUl = document.querySelector("#messages");
    messageUl.innerHTML = "";
    history.forEach((msg) => {
      const newMsg = buildHTML(msg);
      const currentMessages = messageUl.innerHTML;
      messageUl.innerHTML = currentMessages + newMsg;
    });
  });
}
