import { ToastContainer } from "react-toastify";

import { Outlet } from "react-router-dom";
import AdminDashboardHeader from "../../components/Admin/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/Admin/AdminDashboardSidebar";

const AdminDashboardPage = () => {
  return (
    <>
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
      <AdminDashboardHeader />
          <div className="flex items-start justify-between w-full">
      {/* Sidebar takes 1/4 */}
      <div className="  h-[100vh] w-[15%] overflow-y-auto sticky top-0">
        <AdminDashboardSidebar />
      </div>
  
      {/* Main content takes 3/4 */}
      <div className=" w-[85%]">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default AdminDashboardPage;
