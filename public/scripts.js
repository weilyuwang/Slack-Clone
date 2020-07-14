const socket = io("http://localhost:9000"); // the /  namespace

socket.on("connect", () => {
  console.log(socket.id);
});

// listen for nsList event, which contains a list of all namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived!");
  console.log(nsData);
});

// socket.on("messageFromServer", (dataFromServer) => {
//   console.log(dataFromServer);
//   socket.emit("messageToServer", { data: "Hello from the Client" });
// });

// document.querySelector("#message-form").addEventListener("submit", (event) => {
//   event.preventDefault();

//   const newMessage = document.querySelector("#user-message").value;
//   socket.emit("newMessageToServer", { text: newMessage });

//   // clear out user input
//   var userInput = document.querySelector("#user-message");
//   userInput.value = "";
// });

// socket.on("messageToClients", (msg) => {
//   console.log(msg);
//   document.querySelector("#messages").innerHTML += `<l1>${msg.text}</l1>`;
// });
