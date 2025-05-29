<<<<<<< HEAD
import './App.css'
import { Outlet} from 'react-router-dom'
import Header from './componant/Layout/Header'
import Footer from './componant/Layout/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
=======
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./componant/Layout/Header";
import Footer from "./componant/Layout/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

>>>>>>> origin/main


function App() {

  return (
    <>
<<<<<<< HEAD
          <ToastContainer
        position='top-right'
      />
      <Header/>
      <main className='min-h-[calc(100vh-120px)] pt-16 '>
        <Outlet/>
=======
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
      <main className="min-h-[calc(100vh-120px)] pt-16 ">
        <Outlet />
>>>>>>> origin/main
      </main>
      <Footer />
    </>
  );
}

export default App;
