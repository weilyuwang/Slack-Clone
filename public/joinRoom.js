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
    // scroll to the bottom of the messages div
    messageUl.scrollTo(0, messageUl.scrollHeight);
  });

  nsSocket.on("updateMembers", (num) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${num} <span class="glyphicon glyphicon-user"></span
    >`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    let messages = Array.from(document.getElementsByClassName("message-text"));

    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        // The msg does not contain the user search term!
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
