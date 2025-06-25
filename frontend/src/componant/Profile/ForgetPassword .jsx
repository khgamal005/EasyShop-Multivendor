import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearMessages } from "../../redux/slices/userSlice";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
          <div className="text-sm">
                  <Link to="/VerifyResetCode" className="text-blue-600 pl-2">
                verifyResetCode?
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

export default ForgetPassword;
