import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./componant/Layout/Header";
import Footer from "./componant/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";


function App() {
  const socket = useRef(null);
    const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
    const currentUserId = user?._id || seller?._id; // Store the socket instance

  useEffect(() => {
    if (!currentUserId) return;

    socket.current = io("http://localhost:8000");

    socket.current.on("connect", () => {
      console.log("Socket.IO connected:", socket.current.id);
      socket.current.emit("addUser", currentUserId);
    });

    socket.current.on("getUsers", (users) => {
      console.log("Active users:", users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [currentUserId]); // depends on user/seller

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header activeHeading={1} />
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
