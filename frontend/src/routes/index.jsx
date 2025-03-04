import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import SignupPage from '../pages/SignupPage'
import LoginPage from '../pages/LoginPage'
import ActivationPage from '../pages/ActivationPage'

import App from '../App'


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
            

        ]
    }
])


export default router