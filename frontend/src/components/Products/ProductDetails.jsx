import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { toast } from "react-toastify";
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
} from "../../utils/imageHelpers";
import ProductReviews from "./ProductReviews ";
import ShopInfoCard from "./ShopInfoCard ";

const ProductDetails = ({ data, eventData }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user?.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { reviews, loading } = useSelector((state) => state.review);

  const [select, setSelect] = useState(0);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cart));
    }
  }, [cart, user?._id]);

  useEffect(() => {
    if (data?._id) {
      dispatch(fetchReviews(data._id));
    }
  }, [data?._id, dispatch]);

  useEffect(() => {
    setClick(wishlist?.some((item) => item._id === data?._id));
  }, [wishlist, data?._id]);

  const removeFromWishlistHandler = () => {
    dispatch(removeFromWishlist(data._id));
    setClick(false);
    toast.info("Removed from wishlist");
  };

  const addToWishlistHandler = () => {
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

  const addToCartHandler = () => {
             if (!user|| user.role !== "user") {
    toast.error("Please create an account or login as a user to add items to cart.");
    return;
  }
    const isInCart = cart?.some((item) => item._id === data._id);

    if (isInCart && data.stock < count) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: count }));
      toast.success("Added to cart");

      if (user?._id) {
        const updatedCart = [...cart, { ...data, qty: count }];
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
      }
    }
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
                src={eventData ? getEventImageUrl(img) : getProductImageUrl(img)}
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
          <Ratings rating={data.ratingsAverage} />
          <p className="text-gray-700 mt-4">{data.description}</p>

          {/* Product Meta Info */}
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Category:</span>{" "}
              {data.category?.name}
            </p>
            <p>
              <span className="font-medium">Subcategory:</span>{" "}
              {data.subcategories?.[0]?.name || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Color:</span>
              <span
                className="inline-block w-5 h-5 rounded-full border border-gray-400"
                style={{ backgroundColor: data.color }}
              />
            </p>
          </div>

          {/* Price Info */}
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
          <div className="mt-4">
            {click ? (
              <AiFillHeart
                size={30}
                className="cursor-pointer"
                onClick={removeFromWishlistHandler}
                color="red"
                title="Remove from wishlist"
              />
            ) : (
              <AiOutlineHeart
                size={30}
                className="cursor-pointer"
                onClick={addToWishlistHandler}
                title="Add to wishlist"
              />
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mt-12 justify-between pr-3">
            <div className="flex items-center">
              <button
                className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2"
                onClick={decrementCount}
              >
                -
              </button>
              <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                {count}
              </span>
              <button
                className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2"
                onClick={incrementCount}
              >
                +
              </button>
            </div>
          </div>

          <button
            className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center justify-center`}
            onClick={addToCartHandler}
          >
            <span className="text-white flex items-center">
              Add to cart <AiOutlineShoppingCart className="ml-1" />
            </span>
          </button>

          {/* Shop Info Component */}
          <ShopInfoCard shop={data.shop} ratings={data.ratingsQuantity} />
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={data._id} reviews={reviews} loading={loading} />
    </div>
  );
};

export default ProductDetails;
