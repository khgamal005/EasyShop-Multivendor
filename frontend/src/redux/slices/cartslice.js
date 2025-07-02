import { createSlice } from "@reduxjs/toolkit";

// Initial state: empty cart array
const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const index = state.findIndex((i) => i._id === item._id);
      if (index !== -1) {
        state[index] = item;
      } else {
        state.push(item);
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((i) => i._id !== action.payload);
    },
    clearCart: () => {
      return [];
    },
     loadCart: (state, action) => {
      return action.payload || [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart ,loadCart} = cartSlice.actions;
export default cartSlice.reducer;
