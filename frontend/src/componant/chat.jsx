// In ChatComponent.jsx
const sendMessage = (receiverId, text, images = []) => {
  socket.emit("sendMessage", {
    senderId: currentUserId,
    receiverId,
    text,
    images,
  });
};

const markAsSeen = (senderId, messageId) => {
  socket.emit("messageSeen", {
    senderId,
    receiverId: currentUserId,
    messageId,
  });
};


