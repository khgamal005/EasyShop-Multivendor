const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL ,
    credentials: true,
  },
});

// In-memory connected users
let users = [];

const addUser = ({ userId, role }, socketId) => {
  const existing = users.find((u) => u.userId === userId);
  if (existing) {
    existing.socketId = socketId;
  } else {
    users.push({ userId, role, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

const getUser = (userId) => users.find((u) => u.userId === userId);

// === Socket Connection ===
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  // Add user to socket list
  socket.on("addUser", ({ userId, role }) => {
    addUser({ userId, role }, socket.id);
    io.emit("getUsers", users);
  });

  // Receive a message from frontend, emit to recipient
const isValidMessage = (msg) =>
  typeof msg.senderId === "string" &&
  typeof msg.text === "string" &&
  typeof msg.id === "string"; // or whatever structure you expect

socket.on("sendMessage", ({ receiverId, ...message }) => {
  if (!isValidMessage(message)) {
    return;
  }

  const receiver = getUser(receiverId);

  if (receiver) {
    io.to(receiver.socketId).emit("getMessage", message);
  }

  socket.emit("messageSent", {
    ...message,
    status: "delivered",
  });
});
  // const messages = {}; // Object to track messages sent to each user

  // socket.on("sendMessage", ({ senderId, receiverId, text }) => {
  //   const message = createMessage({ senderId, receiverId, text });

  //   const user = getUser(receiverId);

  //   // Store the messages in the `messages` object
  //   if (!messages[receiverId]) {
  //     messages[receiverId] = [message];
  //   } else {
  //     messages[receiverId].push(message);
  //   }

  //   // send the message to the recevier
  //   io.to(user?.socketId).emit("getMessage", message);
  // });


  // Message seen handler
  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const sender = getUser(senderId);
    if (sender) {
      io.to(sender.socketId).emit("messageSeen", {
        senderId,
        receiverId,
        messageId,
      });
    }
  });

  // Update last message in conversation
  socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
    io.emit("getLastMessage", { lastMessage, lastMessageId });
  });

  // Disconnect user
  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// === Server Boot ===
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// === Handle Unhandled Promise Errors ===
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
