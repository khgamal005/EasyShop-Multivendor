import { ToastContainer } from "react-toastify";

import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocketSetup } from "../../hook/useSocketSetup";
import socket from "../../socket";

const ShopDashboardPage = () => {


  const { seller } = useSelector((state) => state.seller);
  const currentUserId =  seller?._id;
  const role ="seller" ;

  useSocketSetup(currentUserId, role); 


  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        {/* Sidebar takes 1/4 */}
        <div className="  h-[100vh] w-[15%] overflow-y-auto sticky top-0">
          <DashboardSideBar />
        </div>

        {/* Main content takes 3/4 */}
        <div className=" w-[85%]">
          <Outlet context={{ socket }} />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
