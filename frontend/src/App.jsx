import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./componant/Layout/Header";
import Footer from "./componant/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "./socket";

function App() {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const currentUserId = user?._id || seller?._id;
  const role = user ? "user" : seller ? "seller" : null;

  useEffect(() => {
    if (currentUserId && role) {
      if (!socket.connected) {
        socket.connect(); // only connect once
      }

      socket.emit("addUser", {
        userId: currentUserId,
        role: role,
      });

      socket.on("getUsers", (users) => {
        console.log("Active users:", users);
      });

      socket.on("getLastMessage", ({ lastMessage, lastMessagesId }) => {
        console.log("🔄 New last message received:", lastMessage);
      });

      socket.on("messageSent", (data) => {
        console.log("✅ Message delivered:", data);
      });
    }

    return () => {
      socket.off("getUsers");
      socket.off("getLastMessage");
      socket.off("messageSent");
    };
  }, [currentUserId, role]); // rerun only if user changes

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
        <Outlet context={{ socket }} />
      </main>
      <Footer />
    </>
  );
}

export default App;
