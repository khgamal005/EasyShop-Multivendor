import styles from "../../styles/styles";

const CartData = ({ handleSubmit, totalPrice, shipping, subTotalPrice, code, setCode, discountPrice }) => {
  return (

    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotalPrice}</h5>
      </div>
      <div className="flex justify-between mt-2">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping.toFixed(2)}</h5>
      </div>
      <div className="flex justify-between mt-2">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">- ${discountPrice.toFixed(2)}</h5>
      </div>
      <div className="text-end pt-3 text-[18px] font-[600]">Total: ${totalPrice}</div>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`${styles.input} h-[40px] pl-2`}
          required
        />
        <button type="submit" className="w-full h-[40px] border border-[#f63b60] text-[#f63b60] rounded-[3px] mt-4 cursor-pointer">
          Apply Coupon
        </button>
      </form>
    </div>
  );
  
}

export default CartData