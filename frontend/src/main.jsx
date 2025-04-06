import { createRoot } from "react-dom/client";
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes'; // Your router configuration
import { Provider } from "react-redux";
import Store from "./redux/store.js";

createRoot(document.getElementById('root')).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
   </Provider>
);
