import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllCoupons } from "../redux/slices/couponeSlice";
import Loader from "../componant/Layout/Loader";

const Coupons = () => {
  const dispatch = useDispatch();

  const { coupons, loading, error } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Coupons</h2>

      {loading ? (
        <Loader /> 
      ) : coupons.length === 0 ? (
        <p>No coupons found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-bold text-blue-600">{coupon.name}</h3>
              <p className="text-sm text-gray-700">Code: {coupon.code}</p>
              <p className="text-sm text-gray-700">Value: {coupon.value}EGP</p>
              <p className="text-sm text-gray-500">Min Amount: EGP{coupon.minAmount}</p>
              <p className="text-sm text-gray-500">Max Discount: EGP{coupon.maxAmount}</p>
              <p className="text-xs text-gray-400 mt-1">
                Expiry: {new Date(coupon.expire).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coupons;
