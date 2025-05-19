import { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { addToCart } from "../../redux/slices/cartslice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { getProductImageUrl } from "../../utils/imageHelpers";

const ProductDetailsCard = ({ setOpen, data }) => {
  console.log(data)
  const wishlist = useSelector((state) => state.wishlist); // wishlist array
  const cart = useSelector((state) => state.cart); // cart array

  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  useEffect(() => {
    setClick(wishlist?.some((item) => item._id === data._id));
  }, [wishlist, data._id]);

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart?.some((item) => item._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else if (data.stock < count) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: count }));
      toast.success("Item added to cart successfully!");
    }
  };

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

  const handleMessageSubmit = () => {
    // Implement your message logic here
  };

  if (!data) return null;

  return (
    <div className="bg-[#fff]">
      <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
        <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
          <RxCross1
            size={30}
            className="absolute right-3 top-3 z-50 cursor-pointer"
            onClick={() => setOpen(false)}
          />

          <div className="block w-full 800px:flex">
            <div className="w-full 800px:w-[50%]">
              <img 
                src={getProductImageUrl(data.images?.[0])}              />
              <div className="flex mt-3">
                <Link to={`/shop/preview/${data}`} className="flex items-center">
                  <img
                    // src={data.shop?.avatar || data.images?.[0]?.url}
                    // alt={data.shop?.name || "Shop"}
                    // className="w-[50px] h-[50px] rounded-full mr-2 object-cover"
                  />
                  <div>
                    <h3 className={styles.shop_name}>{data.nsme}</h3>
                    <h5 className="pb-3 text-[15px]">{data.ratings} Ratings</h5>
                  </div>
                </Link>
              </div>
              <button
                className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11 flex items-center justify-center`}
                onClick={handleMessageSubmit}
              >
                <span className="text-white flex items-center">
                  Send Message <AiOutlineMessage className="ml-1" />
                </span>
              </button>
              <h5 className="text-[16px] text-[red] mt-5">(50) Sold out</h5>
            </div>

            <div className="w-full 800px:w-[50%] pt-5 px-2">
              <h1 className={`${styles.productTitle} text-[20px]`}>{data.name}</h1>
              <p className="mt-2">{data.description}</p>

              <div className="flex pt-3 items-center gap-4">
                <h4 className={styles.productDiscountPrice}>{data.discountPrice}$</h4>
                {data.originalPrice && (
                  <h3 className={styles.price}>{data.originalPrice}$</h3>
                )}
              </div>

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
              </div>

              <button
                className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center justify-center`}
                onClick={() => addToCartHandler(data._id)}
              >
                <span className="text-white flex items-center">
                  Add to cart <AiOutlineShoppingCart className="ml-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
