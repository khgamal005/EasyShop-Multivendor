import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./componant/Layout/Header";
import Footer from "./componant/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useSocketSetup } from "./hook/useSocketSetup"; 
import socket from "./socket"; 


function App() {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const currentUserId = user?._id || seller?._id;
  const role = user ? "user" : null;

  useSocketSetup(currentUserId, role); 


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
