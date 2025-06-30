import { useEffect } from "react";
import socket from "../socket";

export const useSocketSetup = (userId, role) => {
  useEffect(() => {
    if (!userId || !role) return;

    // Always disconnect before reconnecting
    if (socket.connected) {
      socket.disconnect();
    }

    socket.connect();

    // Emit user join
    socket.emit("addUser", { userId, role });

    // Setup listeners
    const handleGetUsers = (users) => console.log("🧑‍🤝‍🧑 Users:", users);
    const handleLastMessage = (payload) => console.log("📩 Last msg:", payload);
    const handleMessageSent = (msg) => console.log("✅ Sent:", msg);

    socket.on("getUsers", handleGetUsers);
    socket.on("getLastMessage", handleLastMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      // Important: cleanup handlers and disconnect
      socket.off("getUsers", handleGetUsers);
      socket.off("getLastMessage", handleLastMessage);
      socket.off("messageSent", handleMessageSent);

      socket.disconnect(); // Clean up when component unmounts or deps change
    };
  }, [userId, role]);
};
