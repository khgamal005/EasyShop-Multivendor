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
import { getProductImageUrl } from "../../utils/imageHelpers";
import { toast } from "react-toastify";

const ProductDetails = ({ data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [select, setSelect] = useState(0);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);


  useEffect(() => {
    dispatch(fetchReviews(data._id));
  }, [data._id, dispatch]);

  useEffect(() => {
    setClick(wishlist?.some((item) => item._id === data._id));
  }, [wishlist, data._id]);


    useEffect(() => {
      setClick(wishlist?.some((item) => item._id === data._id));
    }, [wishlist, data._id]);
  
    const handleWishlist = () => {
    const isInWishlist = wishlist?.some((item) => item._id === data._id);
  
    if (isInWishlist) {
      dispatch(removeFromWishlist(data._id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(data));
      toast.success("Added to wishlist");
    }
  
    };

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart?.some((item) => item._id === id);
    if (isItemExists && data?.stock < count) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: count }));
      toast.success("Item added to cart successfully!");
    }
      console.log(data)

  };

  return !data ? (
    <Loader />
  ) : (
    <div className="w-full py-8 px-4 md:px-8">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* Product Images */}
        <div className="w-full lg:w-1/2">
          <img
            src={getProductImageUrl(data.images?.[select])}
            alt="Product"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {data.images?.map((img, index) => (
              <img
                key={index}
                src={getProductImageUrl(img)}
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
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mt-4 gap-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={incrementCount}
            >
              -
            </button>
            <span>{count}</span>
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={decrementCount}
            >
              +
            </button>
          </div>

          {/* Wishlist & Cart */}
          <div className="flex items-center mt-6 gap-4">
            <button
              onClick={addToCartHandler}
              className={`${styles.button} flex items-center gap-2`}
            >
              <AiOutlineShoppingCart size={20} />
              Add to Cart
            </button>

            <div onClick={handleWishlist} className="cursor-pointer">
              {click ? (
                <AiFillHeart size={24} color="red" />
              ) : (
                <AiOutlineHeart size={24} />
              )}
            </div>
          </div>

          {/* Shop Link */}
          <div className="mt-6">
            <Link to={`/shop/preview/${data.shopId}`}>
              <div className="flex items-center gap-3">
                <img
                  src={data.name || "/images/shop-default.png"}
                  alt="Shop"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{data.name}</h3>
                  <span className="text-sm text-gray-500">
                    ({data.ratings}) Ratings
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
