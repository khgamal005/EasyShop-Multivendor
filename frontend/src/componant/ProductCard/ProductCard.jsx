import { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import styles from "../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import Ratings from "../Products/Ratings";
import { getProductImageUrl } from "../../utils/imageHelpers";

import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartslice";

const ProductCard = ({ data, isEvent }) => {
  const wishlist = useSelector((state) => state.wishlist); // wishlist is an array
  const cart = useSelector((state) => state.cart);         // cart is also an array

  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

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

  const handleAddToCart = () => {
    const exists = cart?.some((item) => item._id === data._id);

    if (exists) {
      toast.error("Item already in cart!");
    } else if (data.stock < 1) {
      toast.error("Product stock limited!");
    } else {
      dispatch(addToCart({ ...data, qty: 1 }));
      toast.success("Item added to cart!");
    }
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <Link
          to={
            isEvent
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }
        >
          <img
            src={getProductImageUrl(data.images?.[0])}
            alt={data.name}
            className="w-full h-[170px] object-contain"
          />
        </Link>

        <Link
          to={
            isEvent
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }
        >
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? `${data.name.slice(0, 40)}...` : data.name}
          </h4>
          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={styles.productDiscountPrice}>
                {data.discountPrice}$
              </h5>
              {data.originalPrice && (
                <h4 className={styles.price}>{data.originalPrice}$</h4>
              )}
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data?.sold_out} sold
            </span>
          </div>
        </Link>

        {/* Action Icons */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={handleWishlist}
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={handleWishlist}
              color="#333"
              title="Add to wishlist"
            />
          )}

          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />

          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={handleAddToCart}
            color="#444"
            title="Add to cart"
          />

          {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
        </div>
      </div>
    </>
  );
};

export default ProductCard;

