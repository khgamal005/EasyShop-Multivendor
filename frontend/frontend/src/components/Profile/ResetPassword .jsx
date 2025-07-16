import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPassword,
  clearMessages,
} from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(resetPassword({ email, newPassword }));
  };

useEffect(() => {
  if (successMessage) {
    toast.success("Your password has been reset successfully!");

    const timeoutId = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
      dispatch(clearMessages());
    };
  }
}, [successMessage, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}
        {successMessage && (
          <p className="text-sm text-green-600 mt-4 text-center">
            {successMessage} Redirecting...
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
