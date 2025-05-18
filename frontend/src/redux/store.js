import { configureStore } from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import { combineReducers } from 'redux';

import userReducer from './slices/userSlice';
import sellerReducer from './slices/sellerslice';
import productReducer from './slices/productslice';
import brandReducer from './slices/brandSlice';
import categoryReducer from './slices/categorySlice';
import subCategoryReducer from './slices/subcategorySlice';
import eventReducer from './slices/eventSlice';
import couponReducer from './slices/couponeSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'seller', 'product', 'brand', 'category', 'subCategory','events','coupon'],
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  seller: sellerReducer,
  product: productReducer,
  brand: brandReducer,
  category: categoryReducer,
  subCategory: subCategoryReducer,
  events: eventReducer,
  coupon:couponReducer
});

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Fix: Add middleware to ignore non-serializable warnings from redux-persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});
const persistor = persistStore(store);

export { store, persistor };
