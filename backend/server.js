// server.js
const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  },
});

let users = [];

const addUser = ({ userId, role }, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, role, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

const messages = {}; // Store messages by receiverId

io.on("connection", (socket) => {
  console.log("🟢 A user connected");

  // Add user (with role: user, admin, seller)
  socket.on("addUser", ({ userId, role }) => {
    addUser({ userId, role }, socket.id);
    io.emit("getUsers", users);
  });

  // Handle message sending
  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });
    const receiver = getUser(receiverId);

    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    // Send to receiver (user, seller, or admin)
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", message);
    }

    // Send delivery confirmation to sender
    socket.emit("messageSent", {
      ...message,
      status: "delivered",
    });
  });

  // Handle message seen
  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const sender = getUser(senderId);

    if (messages[receiverId]) {
      const message = messages[receiverId].find(
        (msg) => msg.senderId === senderId && msg.id === messageId
      );
      if (message) {
        message.seen = true;
        io.to(sender?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });

  // Optional: Update last message info per conversation
  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
    io.emit("getLastMessage", { lastMessage, lastMessagesId });
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
