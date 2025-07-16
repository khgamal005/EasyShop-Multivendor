import { RxCross1 } from "react-icons/rx";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalModal = ({ setPaypalOpen, createOrder, onApprove }) => {
  return (
    <div onClick={() => setPaypalOpen(false)} className="fixed inset-0 z-30 flex justify-center items-center bg-[#000000a7]">
      <div onClick={(e) => e.stopPropagation()} className="bg-white p-5 rounded-md relative w-[450px]">
        <RxCross1 size={25} className="absolute top-2 right-2 cursor-pointer" onClick={() => setPaypalOpen(false)} />
        <PayPalScriptProvider options={{ "client-id": "test" }}>
          <PayPalButtons style={{ layout: "vertical" }} createOrder={createOrder} onApprove={onApprove} />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaypalModal;
