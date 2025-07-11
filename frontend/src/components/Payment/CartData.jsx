const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-white rounded-md p-5">
      <h1 className="text-[22px] font-[600] pb-2 border-b">Order Summary</h1>
      <br />
      <div className="flex justify-between">
        <p>Sub Total</p>
        <p>$ {orderData?.subTotalPrice}</p>
      </div>
      <div className="flex justify-between">
        <p>Shipping</p>
        <p>$ {orderData?.shipping}</p>
      </div>
      <div className="flex justify-between border-t mt-2 pt-2">
        <h1 className="text-[20px] font-[700]">Total</h1>
        <h1 className="text-[20px] font-[700]">$ {orderData?.totalPrice}</h1>
      </div>
    </div>
  );
};

export default CartData;
