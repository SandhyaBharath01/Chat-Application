const messageTextArea = document.getElementById("messageTextArea");
const messageSendBtn = document.getElementById("messageSendBtn");
const chatList = document.getElementById("chatList");

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
    console.log("Something went wrong");
  }
}

async function fetchMessages() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/chat/getMessages", {
      headers: { Authorization: token },
    });
    const messages = response.data.messages;
    chatList.innerHTML = ""; // Clear the chat list before updating
    messages.forEach((message) => {
      updateChatList(message.name + ": " + message.message); // Include the user's name in the chat message
    });
  } catch (err) {
    console.log(err);
  }
}

function updateChatList(message) {
  const messageElement = document.createElement("li");
  messageElement.textContent = message;
  chatList.appendChild(messageElement);
}

window.addEventListener("DOMContentLoaded", () => {
  fetchMessages();
  setInterval(fetchMessages, 1000); // Fetch messages every 1 second
});

messageSendBtn.addEventListener("click", messageSend);
