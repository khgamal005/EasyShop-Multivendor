import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage

// Reducers
import userReducer from './slices/userSlice';
import sellerReducer from './slices/sellerslice';
import productReducer from './slices/productslice';
import brandReducer from './slices/brandSlice';
import categoryReducer from './slices/categorySlice';
import subCategoryReducer from './slices/subcategorySlice';
import eventReducer from './slices/eventSlice';
import couponReducer from './slices/couponeSlice';
import wishlistReducer from './slices/wishlistSlice';
import cartReducer from './slices/cartslice';
import reviewReducer from './slices/reviewSlice';
import orderReducer from './slices/orderSlice';
import withdrawReducer from './slices/wishlistSlice';
import messageReducer from './slices/messageSlice';
import conversationReducer from './slices/conversationSlice';


// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  seller: sellerReducer,
  product: productReducer,
  brand: brandReducer,
  category: categoryReducer,
  subCategory: subCategoryReducer,
  events: eventReducer,
  coupon: couponReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  review:reviewReducer,
  order:orderReducer,
   withdraw: withdrawReducer,
   message: messageReducer,
  conversation: conversationReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'user',
    'seller',
    'product',
    'brand',
    'category',
    'subCategory',
    'events',
    'coupon',
    'wishlist',
    'cart',
    'review',
    "order",
    "withdraw",
    "message",
    "conversation"

  ],
};

// Persist the reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
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

// Persistor
const persistor = persistStore(store);

// Export
export { store, persistor };
