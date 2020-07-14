const socket = io("http://localhost:9000"); // the /  namespace

socket.on("connect", () => {
  console.log(socket.id);
});

// listen for nsList event, which contains a list of all namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived! Check below");
  console.log(nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}>
      <img src=${ns.img}>
    </div>`;
  });

  // Add a click listener for each namespace
  // note document.getElementsByClassName('namespace') returns a HTML collection
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(nsEndpoint);
    });
  });

  const nsSocket = io("http://localhost:9000/wiki");
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });
    // Add click listener to each room
    const roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        console.log("Someone clicked on ", e.target.innerText);
      });
    });
    console.log(roomNodes);
  });
});
