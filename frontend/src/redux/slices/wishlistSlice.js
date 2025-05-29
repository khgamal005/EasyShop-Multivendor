import { createSlice } from "@reduxjs/toolkit";

// Load initial wishlist from localStorage (optional — Redux Persist will override this anyway)
const initialState = localStorage.getItem("wishlistItems")
  ? JSON.parse(localStorage.getItem("wishlistItems"))
  : [];

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState, // 👈 This is now a plain array
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const isItemExist = state.find((i) => i._id === item._id);
      if (!isItemExist) {
        state.push(item);
      }
    },
    removeFromWishlist: (state, action) => {
      return state.filter((i) => i._id !== action.payload);
    },
    clearWishlist: () => {
      return [];
    }
  },
});


export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
