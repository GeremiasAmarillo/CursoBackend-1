const socket = io();

let user;
let chatBox = document.getElementById("chatBox");
let log = document.getElementById("messageLogs");
let sendButton = document.getElementById("sendButton");
let data = [];

socket.on("message", (msg) => {
  data.push(msg);
  renderizar(data);
});

socket.on("messageLogs", (msgs) => {
  renderizar(msgs);
});

const renderizar = (msgs) => {
  let messages = "";

  msgs.forEach((message) => {
    const isCurrentUser = message.user === user;
    const messageClass = isCurrentUser ? "my-message" : "other-message";
    messages += `<div class="${messageClass}">${message.user}: ${message.message}</div>`;
  });

  log.innerHTML = messages;
  log.scrollTop = log.scrollHeight; // Hacer scroll hacia abajo para ver el último mensaje
};

Swal.fire({
  title: "Identifícate",
  input: "email",
  text: "Ingresa tu correo electronico",
  inputValidator: (value) => {
    if (!value) return "Necesitas ingresar el correo electrónico";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) return "Ingresa un correo electrónico válido";

    return null;
  },
  allowOutsideClick: false,
}).then((result) => {
  if (result.isConfirmed) {
    user = result.value;
    renderizar(data);
  }
});

const sendMessage = () => {
  if (chatBox.value.trim().length > 0) {
    const message = chatBox.value;
    socket.emit("message", { user, message });
    chatBox.value = "";
  }
};

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    sendMessage();
  }
});

sendButton.addEventListener("click", () => {
  sendMessage();
});

socket.on("nuevo_user", () => {
  Swal.fire({
    text: "Nuevo usuario se ha conectado",
    toast: true,
    position: "top-right",
  });
});
