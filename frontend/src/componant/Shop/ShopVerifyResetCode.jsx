import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyResetCode,
  clearMessages,
} from "../../redux/slices/sellerslice";
import { Link } from "react-router-dom";

const ShopVerifyResetCode = () => {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector((state) => state.seller);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length !== 6) return alert("Please enter a 6-digit code");
    dispatch(verifyResetCode(code));
  };

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Verify Reset Code</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            6-digit code
          </label>
          <input
            type="text"
            id="code"
            maxLength="6"
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter reset code"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
                    <div className="text-sm">
                  <Link to="/shop/ResetPassword" className="text-blue-600 pl-2">
                ResetPassword?
              </Link>
              </div>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-sm text-green-600 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ShopVerifyResetCode;
