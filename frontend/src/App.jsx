import './App.css'
import { Outlet} from 'react-router-dom'
import Header from './componant/Layout/Header'
import Footer from './componant/Layout/Footer'


function App() {


  return (
    <>
      <Header/>
      <main className='min-h-[calc(100vh-120px)] pt-16 '>
        <Outlet/>
      </main>
      <Footer/>


    </>
  )
}

export default App
