import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("Socket connecting to:", API_BASE_URL); // ✅ Check it's localhost in dev

const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;