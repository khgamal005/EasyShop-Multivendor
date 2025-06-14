
import { NavLink, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag, FiPackage } from "react-icons/fi";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";





const sidebarItems = [
  {
    label: "Dashboard",
    icon: RxDashboard,
    path: "",
    id: "dashboard",
  },
  {
    label: "All Orders",
    icon: FiShoppingBag,
    path: "dashboard-orders",
    id: "orders",
  },
  {
    label: "All Coupons",
    icon: FiPackage,
    path: "All-Coupons",
    id: "Coupones",
  },
  {
    label: "Create coupone",
    icon: AiOutlineFolderAdd,
    path: "create-coupone",
    id: "create-coupone",
  },
  {
    label: "Create brand",
    icon: AiOutlineFolderAdd,
    path: "create-brand",
    id: "create-brand",
  },
  {
    label: "Create category",
    icon: AiOutlineFolderAdd,
    path: "create-category",
    id: "create-category",
  },
  {
    label: "Create subcategory",
    icon: AiOutlineFolderAdd,
    path: "create-subcategory",
    id: "create-subcategory",
  },
  {
    label: "All Events",
    icon: MdOutlineLocalOffer,
    path: "events",
    id: "events",
  },
  {
    label: "Create Event",
    icon: VscNewFile,
    path: "create-event",
    id: "create-event",
  },
  {
    label: "Withdraw Money",
    icon: CiMoneyBill,
    path: "withdraw",
    id: "withdraw",
  },
  {
    label: "Shop Inbox",
    icon: BiMessageSquareDetail,
    path: "messages",
    id: "messages",
  },
  {
    label: "Discount Codes",
    icon: AiOutlineGift,
    path: "coupons",
    id: "coupons",
  },
  {
    label: "Refunds",
    icon: HiOutlineReceiptRefund,
    path: "refunds",
    id: "refunds",
  },
  {
    label: "Settings",
    icon: CiSettings,
    path: "settings",
    id: "settings",
  },
];
const AdminDashboardSidebar = () => {
  return (
       <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
         {sidebarItems.map((item, index) => {
           const Icon = item.icon;
   
           return (
             <div key={index} className="w-full flex items-center p-4">
               <NavLink
                 to={item.path}
                 className={({ isActive }) =>
                   `w-full flex items-center ${isActive ? "text-[crimson]" : "text-[#555]"}`
                 }
                 end={item.path === ""} // Only match exactly for dashboard
               >
                 <Icon
                   size={30}
                   className={({ isActive }) => isActive ? "text-[crimson]" : "text-[#555]"}
                 />
                   <h5 className="hidden md:block pl-2 text-[18px] font-[400]">
                   {item.label}
                 </h5>
               </NavLink>
             </div>
           );
         })}
       </div>
  )
}

export default AdminDashboardSidebar