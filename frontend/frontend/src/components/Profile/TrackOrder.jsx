import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/slices/orderSlice";

const statusMessages = {
  "Processing": "Your order is being prepared.",
  "Transferred to delivery partner": "Your order has been transferred to the delivery partner.",
  "Shipping": "Your order is out for shipping.",
  "Received": "Your order has arrived in your city.",
  "On the way": "Your order is on the way to you.",
  "Delivered": "Your order has been delivered.",
  "Processing refund": "Your refund is being processed.",
  "Refund Success": "Your refund was successful.",
};

const TrackOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-xl font-medium text-gray-600">Loading orders...</h1>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-xl font-medium text-gray-600">No orders found.</h1>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Order ID:</h2>
              <p className="text-sm text-gray-600 truncate">{order._id}</p>
            </div>

            <div className="mb-3">
              <h3 className="text-md font-medium text-gray-700">Status:</h3>
              <span
                className={`inline-block mt-1 px-3 py-1 text-sm rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status.includes("refund")
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {statusMessages[order.status] || order.status}
              </span>
            </div>

            <div className="mb-2">
              <h3 className="text-md font-medium text-gray-700">Total:</h3>
              <p className="text-gray-800 font-bold">${order.totalPrice}</p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-1">
                <strong>Payment:</strong> {order.paymentInfo?.type}
              </p>
              <p>
                <strong>Placed on:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
