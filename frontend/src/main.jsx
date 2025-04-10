import { createRoot } from "react-dom/client";
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes'; // Your router configuration
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js"; // Import store and persistor
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGat


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* PersistGate */}
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
