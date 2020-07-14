const socket = io("http://localhost:9000"); // the /  namespace
let nsSocket = ""; // make nsSocket a global var

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

  joinNs("/wiki");
});
