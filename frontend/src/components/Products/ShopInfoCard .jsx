import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineMessage } from "react-icons/ai";
import { createConversation } from "../../redux/slices/conversationSlice";
import { getSellerImageUrl } from "../../utils/imageHelpers";

const ShopInfoCard = ({ shop, ratings }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  if (!shop) return null;

  const handleMessageSubmit = async () => {
    try {
      const conversation = {
        groupTitle: "",
        userId: user._id,
        sellerId: shop._id,
      };

      const res = await dispatch(createConversation(conversation)).unwrap();
      navigate(`/inbox?conversationId=${res._id}`);
    } catch (err) {
      toast.error("Failed to start conversation.");
      console.error(err);
    }
  };

  return (
 <div className="mt-6 bg-white shadow-md rounded-md p-4">
      <h3 className="text-xl font-semibold mb-4">Seller Info</h3>
      <Link to={`/shop/preview/${shop._id}`} className="block">
        <div className="flex items-center gap-4">
          <img
            src={getSellerImageUrl(shop?.avatar?.url) || "/images/shop-default.png"}
            alt="Shop Avatar"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <h3 className="font-semibold text-lg">{shop.name}</h3>
            <p className="text-sm text-gray-500">{ratings} Ratings</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShopInfoCard;
