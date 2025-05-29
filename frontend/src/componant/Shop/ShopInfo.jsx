import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { persistor } from '../../redux/store'; // import your Redux store's persistor if available
import { logoutSeller } from '../../redux/slices/sellerslice'; // adjust the import path
// import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {

  const {products} = useSelector((state) => state.seller);
  const {seller} = useSelector((state) => state.seller);
  const [isLoading,setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const Navigate = useNavigate();



  
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/shop/logoutSeller`, {
        withCredentials: true,
      });
  
      const persistRoot = JSON.parse(localStorage.getItem('persist:root') || '{}');
      delete persistRoot.seller;
      localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  
      dispatch(logoutSeller()); // Reset Redux seller state
      toast.success(data.message);
      Navigate("/"); // Now UI will reflect logout without reload
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };
  
  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings = products && products.reduce((acc,product) => acc + product.reviews.reduce((sum,review) => sum + review.rating, 0),0);

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
   <>
   {
    isLoading  ? (
      <Loader />
    ) : (
      <div>
      <div className="w-full py-5">
        <div className="w-full flex item-center justify-center">
          <img
            src={`${seller.avatar?.url}`}
            alt=""
            className="w-[150px] h-[150px] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center py-2 text-[20px]">{seller.name}</h3>
        <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
          {seller.description}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{seller.address}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{seller.phoneNumber}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products && products.length}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Shop Ratings</h5>
        <h4 className="text-[#000000b0]">{averageRating}/5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Joined On</h5>
        <h4 className="text-[#000000b0]">{seller?.createdAt?.slice(0, 10)}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
           <Link to="setting">
           <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
            <span className="text-white">Edit Shop</span>
          </div>
           </Link>
          <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
          onClick={logoutHandler}
          >
            <span className="text-white">Log Out</span>
          </div>
        </div>
      )}
    </div>
    )
   }
   </>
  );
};

export default ShopInfo;
