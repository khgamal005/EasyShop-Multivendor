import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BsFillBagFill } from "react-icons/bs";
import styles from "../../styles/styles";
import {
  getAllOrdersOfSeller,
  updateOrderStatus,
  confirmRefund,
} from "../../redux/slices/orderSlice";
import { getProductImageUrl } from "../../utils/imageHelpers";

const ORDER_STATUSES = [
  "Processing",
  "Transferred to delivery partner",
  "Shipping",
  "Received",
  "On the way",
  "Delivered",
];

const REFUND_STATUSES = ["Processing refund", "Refund Success"];

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const [status, setStatus] = useState("");

  const order = orders?.find((item) => item._id === id);

  useEffect(() => {
    dispatch(getAllOrdersOfSeller(seller._id));
  }, [dispatch, seller._id]);

  useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order]);

  const handleStatusUpdate = async () => {
    const action =
      order?.status === "Processing refund"
        ? await dispatch(confirmRefund({ id, status }))
        : await dispatch(updateOrderStatus({ id, status }));

    if (action.meta.requestStatus === "fulfilled") {
      toast.success(
        order?.status === "Processing refund"
          ? "Order refund successful!"
          : "Order status changed successfully"
      );
      dispatch(getAllOrdersOfSeller(seller._id));
    } else {
      toast.error(action.payload || "Failed to update status");
    }
  };

  const renderStatusOptions = (statusList) =>
    statusList.slice(statusList.indexOf(order?.status)).map((option, index) => (
      <option value={option} key={index}>
        {option}
      </option>
    ));

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard/dashboard-orders">
          <div
            className={`${styles.button} !bg-[#fce1e6] text-[#e94560] font-[600] !h-[45px] text-[18px] !rounded-[4px]`}
          >
            Order List
          </div>
        </Link>
      </div>

      {/* Order Info */}
      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{order?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{order?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order Items */}
      <br />
      <br />
      {order?.cart.map((item, index) => (
        <div key={index} className="w-full flex items-start mb-5">
          <img
            src={getProductImageUrl(item.images?.[0])}
            alt=""
            className="w-[80px] h-[80px]"
          />
          <div className="w-full">
            <h5 className="pl-3 text-[20px]">{item.name}</h5>
            <h5 className="pl-3 text-[20px] text-[#00000091]">
              EGP {item.discountPrice} x {item.qty}
            </h5>
          </div>
        </div>
      ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>EGP {order?.totalPrice}</strong>
        </h5>
      </div>

      {/* Shipping and Payment Info */}
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {order?.shippingAddress.address1} {order?.shippingAddress.address2}
          </h4>
          <h4 className="text-[20px]">{order?.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{order?.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{order?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>Status: {order?.paymentInfo?.status || "Not Paid"}</h4>
        </div>
      </div>

      {/* Status Update */}
      <br />
      <br />
      <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>
      {order?.status && !REFUND_STATUSES.includes(order.status) && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {renderStatusOptions(ORDER_STATUSES)}
        </select>
      )}

      {REFUND_STATUSES.includes(order?.status) && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {renderStatusOptions(REFUND_STATUSES)}
        </select>
      )}

      {/* Update Button */}
      <div
        className={`${
          styles.button
        } mt-5 !bg-[#FCE1E6] text-[#E94560] font-[600] !h-[45px] text-[18px] !rounded-[4px] ${
          status === order?.status
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={status !== order?.status ? handleStatusUpdate : undefined}
      >
        Update Status
      </div>
    </div>
  );
};

export default OrderDetails;
