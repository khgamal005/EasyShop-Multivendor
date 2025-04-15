import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import EasyShopLogo from "../../Layout/EasyShopLogo";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  console.log(seller.avatar.url);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4 ">
      <div>
        <Link to="/">
          <EasyShopLogo />
        </Link>
      </div>
      <div className="flex  items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/cupouns" className="hidden sm:block ">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-events" className="hidden sm:block ">
            <smOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="hidden sm:block ">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="hidden sm:block ">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="hidden sm:block ">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link
  to={`/shop/${seller?._id}`}
  className="relative group inline-block"
>
  <img
    src={seller?.avatar?.url}
    alt="Seller"
    className="w-[50px] h-[50px] rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
  />

  {/* Hover Text */}
  <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap">
    Visit Seller Page
  </div>
</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
