const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");

async function messageSend() {
  try {
    const message = messageTextArea.value;
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:3000/chat/sendMessage",
      {
        message: message,
      },
      { headers: { Authorization: token } }
    );
    console.log(res.data);

  } catch (error) {
    console.log("something went wrong");
  }
}

async function fetchMessages() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/chat/getMessages", {
      headers: { Authorization: token },
    });
    const messages = response.data.messages;
    messages.forEach((message) => {
      updateChatList(message.name + ": " + message.message); // Include the user's name in the chat message
    });
  } catch (err) {
    console.log(err);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  fetchMessages();
});

function updateChatList(message) {
  // Update the chat list UI with the received message
  const chatList = document.getElementById("chatList");
  const messageElement = document.createElement("li");
  messageElement.textContent = message;
  chatList.appendChild(messageElement);
}


messageSendBtn.addEventListener("click", messageSend);