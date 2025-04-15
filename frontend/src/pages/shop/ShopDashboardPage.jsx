


import DashboardHeader from "../../componant/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../componant/Shop/Layout/DashboardSideBar";
import { Outlet } from "react-router-dom";

const ShopDashboardPage = () => {
  return (
    <div>
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
