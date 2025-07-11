import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useSocketSetup } from "./hook/useSocketSetup"; 
import socket from "./socket"; 
import { useEffect } from "react";
import { clearCart, loadCart } from "./redux/slices/cartslice";


function App() {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const currentUserId = user?._id || seller?._id;
  const role = user ? "user" : null;

  useSocketSetup(currentUserId, role); 
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      const savedCart = localStorage.getItem(`cart_${user._id}`);
      if (savedCart) {
        dispatch(loadCart(JSON.parse(savedCart)));
      } else {
        dispatch(clearCart());
      }
    } else {
      dispatch(clearCart());
    }
  }, [user?._id, dispatch]);


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
