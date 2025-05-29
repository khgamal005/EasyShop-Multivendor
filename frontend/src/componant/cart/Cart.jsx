// Cart.js
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/slices/cartslice";
import { toast } from "react-toastify";
import { getProductImageUrl } from "../../utils/imageHelpers";

const Cart = ({ setOpenCart }) => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart(item._id));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (item) => {
    dispatch(addToCart(item));
  };
  const handleCheckout = () => {
    setOpenCart(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll shadow-sm">
        {cart.length === 0 ? (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="self-end p-5">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5 className="text-lg">Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div className="flex justify-end pt-5 pr-5">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <div className={`${styles.noramlFlex} p-4`}>
              <IoBagHandleOutline size={25} />
              <h5 className="pl-2 text-[20px] font-[500]">
                {cart.length} items
              </h5>
            </div>
            <div className="w-full border-t">
              {cart.map((item, index) => (
                <CartSingle
                  key={index}
                  data={item}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
            </div>
            <div
              onClick={handleCheckout}
              className="h-[45px] flex items-center justify-center bg-[#e44343] rounded-[5px] cursor-pointer"
            >
              <h1 className="text-white text-[18px] font-[600]">
                Checkout Now (USD${totalPrice.toFixed(2)})
              </h1>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = () => {
    if (data.stock <= value) {
      toast.error("Product stock limited!");
      return;
    }
    setValue(value + 1);
    quantityChangeHandler({ ...data, qty: value + 1 });
  };

  const decrement = () => {
    const newQty = value === 1 ? 1 : value - 1;
    setValue(newQty);
    quantityChangeHandler({ ...data, qty: newQty });
  };

  return (
    <div className="border-b p-4">
      <div className="flex items-center">
        <div className="flex flex-col items-center gap-1">
          <div
            className="bg-[#e44343] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={increment}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span>{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={decrement}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <img
          src={getProductImageUrl(data.images?.[0])}
          alt={data.name}
          className="w-[130px] ml-2 mr-2 rounded-[5px]"
        />
        <div className="flex-1 pl-[5px]">
          <h1 className="font-medium">{data.name}</h1>
          <h4 className="text-sm text-gray-600">
            ${data.discountPrice} × {value}
          </h4>
          <h4 className="text-lg text-[#d02222] font-semibold">
            US${totalPrice.toFixed(2)}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
