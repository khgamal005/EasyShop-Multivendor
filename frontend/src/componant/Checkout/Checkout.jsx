import { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { applyCoupon, clearCoupon } from "../../redux/slices/couponeSlice";
import ShippingInfo from "./ShippingInfo";
import CartData from "./CartData";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const { appliedCoupon, loading, error } = useSelector((state) => state.coupon);

  const [form, setForm] = useState({
    country: "",
    city: "",
    address1: "",
    zipCode: "",
    phoneNumber:""
  });

  const [userInfo, setUserInfo] = useState(false);
  const [code, setCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
  return () => {
    dispatch(clearCoupon());
  };
}, [dispatch]);

  useEffect(() => {
    if (appliedCoupon && appliedCoupon.discount) {
      setDiscountPrice((cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0) * appliedCoupon.discount) / 100);
      setCouponApplied(true);
    } else {
      setDiscountPrice(0);
    }
  }, [appliedCoupon, cart]);

  const subTotalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  const shipping = 20;
  const totalPrice = (subTotalPrice + shipping - discountPrice).toFixed(2);

  const handleApply = async(e) => {
    e.preventDefault();
    if (!code.trim()) return;
   const action = await  dispatch(applyCoupon(code.trim()));
   if (applyCoupon.fulfilled.match(action)) {
             toast.success("copon apply successfully");
             setCode("");
      
           } else {
             toast.error(action.payload || "Failed to apply copon");
           }
  };

  const paymentSubmit = () => {
    const { address1, zipCode, country, city,phoneNumber } = form;
    if (!address1  || !zipCode || !country || !city ||phoneNumber) {
      return toast.error("Please choose your delivery address!");
    }

    const shippingAddress = { address1, zipCode, country, city };
    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
      phoneNumber
    };

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            form={form}
            setForm={setForm}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleApply}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            code={code}
            setCode={setCode}
            discountPrice={discountPrice}
          />
        </div>
      </div>
      <div className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`} onClick={paymentSubmit}>
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};





export default Checkout;
