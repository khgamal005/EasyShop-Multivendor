import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartslice";
import { fetchReviews } from "../../redux/slices/reviewSlice";
import Ratings from "../Products/Ratings";
import Loader from "../Layout/Loader";
import styles from "../../styles/styles";
import {
  getEventImageUrl,
  getProductImageUrl,
  getSellerImageUrl,
} from "../../utils/imageHelpers";
import { toast } from "react-toastify";

const ProductDetails = ({ data, eventData }) => {

  const dispatch = useDispatch();
  const  cart  = useSelector((state) => state.cart);
  const  wishlist  = useSelector((state) => state.wishlist);
  const [select, setSelect] = useState(0);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  console.log(wishlist);
  useEffect(() => {
    dispatch(fetchReviews(data._id));
  }, [data._id, dispatch]);

  useEffect(() => {
    setClick(wishlist?.some((item) => item._id === data._id));
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data._id));
    setClick(false);
    toast.info("Removed from wishlist");
  };

  const addToWishlistHandler = (data) => {
    dispatch(addToWishlist(data));
    setClick(true);
    toast.success("Added to wishlist");
  };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart?.some((item) => item._id === id);
   console.log(data.stock,cart,count) 
    if (isItemExists && data?.stock < count) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: count }));
      toast.success("Item added to cart successfully!");
    }
      console.log(data)

  };
  if (!data) return <Loader />;

  return (
    <div className="w-full py-8 px-4 md:px-8">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <img
            src={
              eventData
                ? getEventImageUrl(data.images?.[select])
                : getProductImageUrl(data.images?.[select])
            }
            alt="Product"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {data.images?.map((img, index) => (
              <img
                key={index}
                src={
                  eventData ? getEventImageUrl(img) : getProductImageUrl(img)
                }
                alt={`Preview ${index}`}
                onClick={() => setSelect(index)}
                className={`w-20 h-20 object-cover border rounded-md cursor-pointer ${
                  select === index ? "border-blue-500" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
          <Ratings rating={data.ratings} />
          <p className="text-gray-700 mt-4">{data.description}</p>

          <div className="mt-4">
            <span className="text-xl font-semibold text-red-600">
              ${data.discountPrice}
            </span>
            {data.discountPrice !== data.originalPrice && (
              <span className="ml-2 text-gray-500 line-through">
                ${data.originalPrice}
              </span>
            )}
            <h5 className="text-[16px] text-[red] mt-5">{data.stock} stock</h5>
          </div>

          {/* Wishlist Icon */}
          <div>
            {click ? (
              <AiFillHeart
                size={30}
                className="cursor-pointer"
                onClick={() => removeFromWishlistHandler(data)}
                color="red"
                title="Remove from wishlist"
              />
            ) : (
              <AiOutlineHeart
                size={30}
                className="cursor-pointer"
                onClick={() => addToWishlistHandler(data)}
                title="Add to wishlist"
              />
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mt-12 justify-between pr-3">
            <div className="flex items-center">
              <button
                className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                onClick={decrementCount}
              >
                -
              </button>
              <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                {count}
              </span>
              <button
                className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                onClick={incrementCount}
              >
                +
              </button>
            </div>
          </div>

                 <button
                className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center justify-center`}
                onClick={() => addToCartHandler(data._id)}
              >
                <span className="text-white flex items-center">
                  Add to cart <AiOutlineShoppingCart className="ml-1" />
                </span>
              </button>

          {/* Shop Link */}
          <div className="mt-6">
            <Link to={`/shop/preview/${data.shopId}`}>
              <div className="flex items-center gap-3">
                <img
                  src={
                    getSellerImageUrl(data.shop.avatar?.url) ||
                    "/images/shop-default.png"
                  }
                  alt="Shop"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{data.name}</h3>
                  <span className="text-sm text-gray-500">
                    ({data.ratingsQuantity}) Ratings
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
