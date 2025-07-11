
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EasyShopLogo from "../Layout/EasyShopLogo";
import { getUserImageUrl } from "../../utils/imageHelpers";

// ...

const AdminDashboardHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4 ">
      <div>
        <Link to="/">
          <EasyShopLogo />
        </Link>
      </div>
      <div className="flex  items-center">
        <div className="flex items-center mr-4">
    
      
          <Link to={`/profile`} className="relative group inline-block">
            <img
              src={getUserImageUrl(user.avatar?.url)}
              alt="Seller"
              className="w-[50px] h-[50px] rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            {/* Hover Text */}
            <div
              className="absolute bottom-[-30px] left-1/2 -translate-x-1/2
   bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap"
            >
              Visit admin Page
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
