import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { clearCart } from "../../redux/slices/cartslice";
import PaymentInfo from "./PaymentInfo";
import CartData from "./CartData";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [paypalOpen, setPaypalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedOrder = localStorage.getItem("latestOrder");
    if (storedOrder) setOrderData(JSON.parse(storedOrder));
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user,
    totalPrice: orderData?.totalPrice,
  };

  const createOrder = (data, actions) =>
    actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => orderID);

  const onApprove = (data, actions) =>
    actions.order.capture().then(({ payer }) => {
      if (payer) paypalPaymentHandler(payer);
    });

  const paypalPaymentHandler = async (paymentInfo) => {
    try {
      order.paymentInfo = {
        id: paymentInfo.payer_id,
        status: "succeeded",
        type: "Paypal",
      };
      await axios.post(`${server}/order/create-order`, order);
      handlePostOrderSuccess();
    } catch {
      toast.error("Paypal payment failed");
    }
  };

const paymentHandler = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    toast.error("Stripe is not loaded yet.");
    return;
  }

  try {
    // Get client secret from backend
    const { data } = await axios.post(
      `${server}/payment/process`,
      { amount: Math.round(orderData?.totalPrice * 100) },
      { withCredentials: true }
    );

    // Confirm card payment
    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    });

    if (result.error) {
      console.error("Stripe error:", result.error.message);
      toast.error(result.error.message);
      return;
    }

    if (result.paymentIntent.status !== "succeeded") {
      toast.error("Payment was not successful. Please try again.");
      return;
    }

    // Clone orderData to avoid mutating shared state
    const newOrder = {
      ...orderData,
      paymentInfo: {
        id: result.paymentIntent.id,
        status: result.paymentIntent.status,
        type: "Credit Card",
      },
    };

    // Create order in backend
    await axios.post(`${server}/order/create-order`, newOrder);

    // Clear cart and navigate
    handlePostOrderSuccess();

  } catch (err) {
    console.error("Payment processing error:", err);
    toast.error("Payment failed. Please try again.");
  }
};


  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/order/create-order`, {
        ...orderData,
        user,
        paymentInfo: { type: "Cash On Delivery" },
      });
      handlePostOrderSuccess();
    } catch {
      toast.error("Failed to place order.");
    }
  };

  const handlePostOrderSuccess = () => {
    toast.success("Order successful!");
    navigate("/order/success");
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("latestOrder", JSON.stringify([]));
dispatch(clearCart({ userId: user._id }));
  };

  if (!orderData) return <div>Loading order data...</div>;

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            paypalOpen={paypalOpen}
            setPaypalOpen={setPaypalOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] mt-8 800px:mt-0">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
