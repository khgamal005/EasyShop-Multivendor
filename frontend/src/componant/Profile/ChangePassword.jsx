import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeUserPassword, clearMessages } from "../../redux/slices/userSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(changeUserPassword({ oldPassword, newPassword, confirmPassword }));
  };

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

        {successMessage && (
          <p className="text-green-600 text-center font-medium">{successMessage}</p>
        )}
        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
