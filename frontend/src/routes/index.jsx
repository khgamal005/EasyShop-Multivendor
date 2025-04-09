import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import SignupPage from '../pages/SignupPage'
import LoginPage from '../pages/LoginPage'
import ActivationPage from '../pages/ActivationPage'

import App from '../App'
import ProductsPage from '../pages/ProductsPage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import BestSellingPage from '../pages/BestSellingPage'
import FAQPage from '../pages/FAQPage'
import EventsPage from '../pages/EventsPage'


const router = createBrowserRouter([
    {
        path : "/",
        element :<App/>,
        children : [
            {
                path : "",
                element : <HomePage/>
            },
            {
                path : "login",
                element : <LoginPage/>
            },

            {
                path : "sign-up",
                element : <SignupPage/>
            },
            {
                path : "activation/:token",
                element : <ActivationPage/>
            },
            
            {
                path : "products",
                element : <ProductsPage/>
            },
            
             {
                path : "product/:id",
                element : <ProductDetailsPage/>
            },
            
            {
                path : "best-selling",
                element : <BestSellingPage/>
            },
            {
                path : "events",
                element : <EventsPage/>
            },
            {
                path : "faq",
                element : <FAQPage/>
            },
            {
                path : "profile",
                element : <ProfilePage/>
            },
             

        ]
    }
])


export default router