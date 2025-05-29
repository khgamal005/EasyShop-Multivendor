import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineLogin,
  AiOutlineMessage,
} from "react-icons/ai";
import {
  RiLockPasswordLine
} from "react-icons/ri";
import {
  HiOutlineReceiptRefund,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../redux/slices/userSlice";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();





  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
  
      const persistRoot = JSON.parse(localStorage.getItem('persist:root') || '{}');
      delete persistRoot.user;
      localStorage.setItem('persist:root', JSON.stringify(persistRoot));
  
      dispatch(logoutSuccess()); // Reset Redux seller state
      toast.success(data.message);
      navigate("/"); // Now UI will reflect logout without reload
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };
  

  const sidebarItems = [
    {
      label: "Profile",
      icon: RxPerson,
      path: "/profile",
    },
    {
      label: "Orders",
      icon: HiOutlineShoppingBag,
      path: "/profile-orders",
    },
    {
      label: "Refunds",
      icon: HiOutlineReceiptRefund,
      path: "/profile-refunds",
    },
    {
      label: "Inbox",
      icon: AiOutlineMessage,
      path: "/inbox",
    },
    {
      label: "Track Order",
      icon: MdOutlineTrackChanges,
      path: "/track-order",
    },
    {
      label: "Change Password",
      icon: RiLockPasswordLine,
      path: "/profile-change-password",
    },
    {
      label: "Address",
      icon: TbAddressBook,
      path: "/profile-address",
    },
  ];

  if (user?.role === "admin") {
    sidebarItems.push({
      label: "Admin Dashboard",
      icon: MdOutlineAdminPanelSettings,
      path: "/admin-dashboard",
    });
  }

  return (
    <div className="w-full">
      {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center cursor-pointer w-full mb-8 ${
                isActive ? "text-[red]" : "text-[#000]"
              }`
            }
          >
            <Icon size={20}
              className={({ isActive }) => isActive ? "text-[crimson]" : "text-[#555]"}
            />
             <h5 className="hidden md:block pl-2 text-[18px] font-[400]">
                {item.label}
              </h5>
          </NavLink>
        );
      })}

      {/* Logout item */}
      <div
        className="flex items-center cursor-pointer w-full mb-8 text-[#000]"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={20} />
        <span className="pl-3 hidden md:block text-[16px]">Log out</span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
