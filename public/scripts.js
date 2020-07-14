const socket = io("http://localhost:9000"); // the /  namespace

socket.on("connect", () => {
  console.log(socket.id);
});

// listen for nsList event, which contains a list of all namespaces
socket.on("nsList", (nsData) => {
  console.log("The list of namespaces has arrived!");
  console.log(nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.namespace}>
      <img src=${ns.img}>
    </div>`;
  });
});
