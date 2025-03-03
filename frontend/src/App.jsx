import './App.css'
import { Outlet} from 'react-router-dom'
import Header from './componant/Layout/Header'
import Footer from './componant/Layout/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {


  return (
    <>
          <ToastContainer
        position='top-right'
      />
      <Header/>
      <main className='min-h-[calc(100vh-120px)] pt-16 '>
        <Outlet/>
      </main>
      <Footer/>


    </>
  )
}

export default App
