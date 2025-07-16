// src/socket.js
import { io } from "socket.io-client";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ENDPOINT = API_BASE_URL;
const socket = io(ENDPOINT, {
  transports: ["websocket"],
  autoConnect: false, // do not connect immediately
});

export default socket;
