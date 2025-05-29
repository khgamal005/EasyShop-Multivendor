
import { ToastContainer } from "react-toastify";

import DashboardHeader from "../../componant/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../componant/Shop/Layout/DashboardSideBar";
import { Outlet } from "react-router-dom";

const ShopDashboardPage = () => {
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
        <Outlet />
      </div>
    </div>
  </div>
  );
};

export default ShopDashboardPage;
