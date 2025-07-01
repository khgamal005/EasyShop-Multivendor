import { useEffect } from "react";
import socket from "../socket";

export const useSocketSetup = (userId, role) => {
  useEffect(() => {
    if (!userId || !role) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("addUser", { userId, role });

    // Listeners
    const handleGetUsers = (users) => console.log("🧑‍🤝‍🧑 Users:", users);
    const handleLastMessage = (payload) => console.log("📩 Last msg:", payload);
    const handleMessageSent = (msg) => console.log("✅ Sent:", msg);

    socket.on("getUsers", handleGetUsers);
    socket.on("getLastMessage", handleLastMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("getUsers", handleGetUsers);
      socket.off("getLastMessage", handleLastMessage);
      socket.off("messageSent", handleMessageSent);

      socket.disconnect();
    };
  }, [userId, role]);
};
