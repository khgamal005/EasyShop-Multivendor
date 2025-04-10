import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import userReducer from './slices/userSlice'; // Your user slice
import { combineReducers } from 'redux';

// Persist configuration
const persistConfig = {
  key: 'root', // Key for localStorage
  storage, // Use localStorage
  whitelist: ['user'], // Persist only user data (or any other slice you want)
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer, // Use persisted reducer
});

const persistor = persistStore(store);

export { store, persistor };
