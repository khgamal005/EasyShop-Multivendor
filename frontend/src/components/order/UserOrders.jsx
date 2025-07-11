import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa"; // example icon
import Loader from "../Layout/Loader";

const UserOrders = ( ) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, isLoading, error } = useSelector((state) => state.order);
  const { user} = useSelector((state) => state.user);


  useEffect(() => {
    if (user) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user._id]);

  if (isLoading) return <Loader/> ;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <button
                onClick={() => navigate(`/user/order/${order._id}`)}
                className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-blue-700"
              >
                View <FaArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
