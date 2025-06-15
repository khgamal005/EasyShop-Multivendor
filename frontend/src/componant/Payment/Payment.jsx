import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { clearCart } from "../../redux/slices/cartslice";

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [paypalOpen, setPaypalOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch =useDispatch()

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
console.log(orderData)
  // PayPal: Create order on PayPal side
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

  // PayPal: When approved
  const onApprove = (data, actions) =>
    actions.order.capture().then(({ payer }) => {
      if (payer) {
        paypalPaymentHandler(payer);
      }
    });

  const paypalPaymentHandler = async (paymentInfo) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      order.paymentInfo = {
        id: paymentInfo.payer_id,
        status: "succeeded",
        type: "Paypal",
      };
      await axios.post(`${server}/order/create-order`, order, config);
      setPaypalOpen(false);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      toast.error("Paypal payment failed");
    }
  };

  // Stripe payment data
  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  // Stripe: Handle card payment
  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config
      );

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          type: "Credit Card",
        };
        await axios.post(`${server}/order/create-order`, order, config);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      }
    } catch (error) {
      toast.error("Payment failed, please try again.");
    }
  };

  // Cash on Delivery
 const cashOnDeliveryHandler = async (e) => {
  e.preventDefault();

  if (!orderData) {
    toast.error("Order data not loaded.");
    return;
  }

  try {
    const config = { headers: { "Content-Type": "application/json" } };

    const order = {
      cart: orderData.cart,
      shippingAddress: orderData.shippingAddress,
      user,
      totalPrice: orderData.totalPrice,
      subTotalPrice: orderData.subTotalPrice,
      shipping: orderData.shipping,
      discountPrice: orderData.discountPrice,
      paymentInfo: { type: "Cash On Delivery" },
    };

    await axios.post(`${server}/order/create-order`, order, config);

    toast.success("Order successful!");
    navigate("/order/success");
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("latestOrder", JSON.stringify([]));
    dispatch(clearCart())
  } catch (error) {
    console.error("Order error:", error?.response?.data || error.message);
    toast.error("Failed to place order.");
  }
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
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  paypalOpen,
  setPaypalOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(1);

  const inputStyle = {
    base: {
      fontSize: "19px",
      lineHeight: 1.5,
      color: "#444",
    },
    empty: {
      color: "#3a120a",
      backgroundColor: "transparent",
      "::placeholder": { color: "#444" },
    },
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      {/* Payment Method Selection */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <MethodRadio
            selected={selectedMethod === 1}
            onClick={() => setSelectedMethod(1)}
            label="Pay with Debit/credit card"
          />
        </div>

        {selectedMethod === 1 && (
          <form className="w-full flex border-b" onSubmit={paymentHandler}>
            <div className="w-full pb-3 flex">
              <div className="w-1/2">
                <label className="block pb-2">Name On Card</label>
                <input
                  required
                  placeholder={user?.name || "Name"}
                  className={`${styles.input} !w-[95%] text-[#444]`}
                  value={user?.name || ""}
                  readOnly
                />
              </div>
              <div className="w-1/2">
                <label className="block pb-2">Exp Date</label>
                <CardExpiryElement className={styles.input} options={{ style: inputStyle }} />
              </div>
            </div>

            <div className="w-full pb-3 flex">
              <div className="w-1/2">
                <label className="block pb-2">Card Number</label>
                <CardNumberElement className={`${styles.input} !h-[35px] !w-[95%]`} options={{ style: inputStyle }} />
              </div>
              <div className="w-1/2">
                <label className="block pb-2">CVV</label>
                <CardCvcElement className={`${styles.input} !h-[35px]`} options={{ style: inputStyle }} />
              </div>
            </div>

            <input
              type="submit"
              value="Submit"
              className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            />
          </form>
        )}
      </div>

      <br />

      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <MethodRadio
            selected={selectedMethod === 2}
            onClick={() => setSelectedMethod(2)}
            label="Pay with Paypal"
          />
        </div>

        {selectedMethod === 2 && (
          <>
            <div
              className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              onClick={() => setPaypalOpen(true)}
            >
              Pay Now
            </div>
            {paypalOpen && (
              <PaypalModal setPaypalOpen={setPaypalOpen} onApprove={onApprove} createOrder={createOrder} />
            )}
          </>
        )}
      </div>

      <br />

      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <MethodRadio
            selected={selectedMethod === 3}
            onClick={() => setSelectedMethod(3)}
            label="Cash on Delivery"
          />
        </div>

        {selectedMethod === 3 && (
          <form className="w-full flex" onSubmit={cashOnDeliveryHandler}>
            <input
              type="submit"
              value="Place Order"
              className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            />
          </form>
        )}
      </div>
    </div>
  );
};

const MethodRadio = ({ selected, onClick, label }) => (
  <div className="flex items-center mr-4 cursor-pointer" onClick={onClick}>
    <div className={`w-5 h-5 border border-[#f63b60] rounded-[50%] flex justify-center items-center mr-1`}>
      {selected && <div className="w-3 h-3 rounded-[50%] bg-[#f63b60]" />}
    </div>
    <p className="text-[#444] font-semibold">{label}</p>
  </div>
);

const PaypalModal = ({ setPaypalOpen, onApprove, createOrder }) => {
  return (
    <div
      onClick={() => setPaypalOpen(false)}
      className="fixed inset-0 z-30 flex justify-center items-center bg-[#000000a7]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-5 rounded-md relative w-[450px]"
      >
        <RxCross1
          size={25}
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => setPaypalOpen(false)}
        />
        <PayPalScriptProvider options={{ "client-id": "test" }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-white rounded-md p-5">
      <h1 className="text-[22px] font-[600] pb-2 border-b">Order Summary</h1>
      <br />
      <div className="flex justify-between">
        <p>Sub Total</p>
        <p>$ {orderData?.totalPrice}</p>
      </div>

      <div className="flex justify-between border-t mt-2 pt-2">
        <h1 className="text-[20px] font-[700]">Total</h1>
        <h1 className="text-[20px] font-[700]">$ {orderData?.totalPrice}</h1>
      </div>
    </div>
  );
};

export default Payment;
