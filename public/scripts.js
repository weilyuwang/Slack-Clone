const socket = io("http://localhost:9000"); // the /  namespace
const socket_admin = io("http://localhost:9000/admin"); // the /admin namespace

socket_admin.on("welcome", (msg) => {
  console.log(msg);
});

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("joined", (msg) => {
  console.log(msg);
});

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "Hello from the Client" });
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: newMessage });

  // clear out user input
  var userInput = document.querySelector("#user-message");
  userInput.value = "";
});
