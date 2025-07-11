
import { NavLink, useNavigate } from "react-router-dom";
import {
  AiOutlineLogin,
  AiOutlineMessage,
} from "react-icons/ai";
import {
  RiLockPasswordLine
} from "react-icons/ri";

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
import { clearConversations } from "../../redux/slices/conversationSlice";

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const dispatch =useDispatch()
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(logoutSuccess())
        dispatch(clearConversations());

        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const sidebarItems = [
    {
      label: "Profile",
      icon: RxPerson,
      path: "/profile",
    },
    {
      label: "Inbox",
      icon: AiOutlineMessage,
      path: "/inbox",
    },
    {
      label: "Change Password",
      icon: RiLockPasswordLine,
      path: "/profile-change-password",
    },

  ];

  if (user?.role === "admin") {
    sidebarItems.push({
      label: "Admin Dashboard",
      icon: MdOutlineAdminPanelSettings,
      path: "/admin-dashboard",
    });
  }

  if (user?.role === "user") {
    sidebarItems.push({
      label: "All Orders",
      icon: RiLockPasswordLine,
      path: "/AllOrders",
    });
  }
  if (user?.role === "user") {
    sidebarItems.push({
      label: "Track Order",
      icon: MdOutlineTrackChanges,
      path: "/track-order",
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
