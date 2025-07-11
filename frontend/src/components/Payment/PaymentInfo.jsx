import { useState } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { RxCross1 } from "react-icons/rx";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import styles from "../../styles/styles";
import {
  useStripe,
  useElements,

} from "@stripe/react-stripe-js";

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
    const stripe = useStripe();
  const elements = useElements();

  const inputStyle = {
    base: { fontSize: "19px", lineHeight: 1.5, color: "#444" },
    empty: {
      color: "#3a120a",
      backgroundColor: "transparent",
      "::placeholder": { color: "#444" },
    },
  };

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      {/* Credit/Debit */}
      <div className="flex w-full pb-5 border-b mb-2">
        <MethodRadio
          selected={selectedMethod === 1}
          onClick={() => setSelectedMethod(1)}
          label="Pay with Debit/credit card"
        />
      </div>
      {selectedMethod === 1 && (
<form
  className="w-full border-b border-gray-200 pb-6 mb-6 space-y-6"
  onSubmit={paymentHandler}
>
  {/* Row 1 */}
  <div className="flex flex-col md:flex-row gap-6">
    <div className="md:w-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Name On Card
      </label>
      <input
        required
        placeholder={user?.name || "Name"}
        className="w-full border rounded px-4 py-2 text-[#444]"
        value={user?.name || ""}
        readOnly // optional
      />
    </div>
  </div>

  {/* Stripe Card Elements */}
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Card Number
      </label>
      <div className="border rounded px-4 py-2">
        <CardNumberElement id="cardNumber" />
      </div>
    </div>
    <div className="flex gap-4">
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expiry Date
        </label>
        <div className="border rounded px-4 py-2">
          <CardExpiryElement />
        </div>
      </div>
      <div className="w-1/2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CVC
        </label>
        <div className="border rounded px-4 py-2">
          <CardCvcElement />
        </div>
      </div>
    </div>
  </div>

  {/* Submit */}
  <div>
    <input
      type="submit"
      value="Submit"
        disabled={!stripe || !elements}
      className="bg-[#f63b60] text-white py-3 px-6 rounded-md cursor-pointer text-lg font-semibold hover:bg-[#e92d55] transition"
    />
  </div>
</form>

      )}

      {/* PayPal */}
      <div className="flex w-full pb-5 border-b mt-4 mb-2">
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
            <PaypalModal
              setPaypalOpen={setPaypalOpen}
              onApprove={onApprove}
              createOrder={createOrder}
            />
          )}
        </>
      )}

      {/* Cash On Delivery */}
      <div className="flex w-full pb-5 border-b mt-4 mb-2">
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
  );
};

const MethodRadio = ({ selected, onClick, label }) => (
  <div className="flex items-center mr-4 cursor-pointer" onClick={onClick}>
    <div
      className={`w-5 h-5 border border-[#f63b60] rounded-full flex justify-center items-center mr-1`}
    >
      {selected && <div className="w-3 h-3 rounded-full bg-[#f63b60]" />}
    </div>
    <p className="text-[#444] font-semibold">{label}</p>
  </div>
);

const PaypalModal = ({ setPaypalOpen, onApprove, createOrder }) => (
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

export default PaymentInfo;
