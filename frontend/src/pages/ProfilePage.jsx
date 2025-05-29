import  { useState } from "react";
import Loader from "../componant/Layout/Loader";
import ProfileSideBar from "../componant/Profile/ProfileSidebar";
import ProfileContent from "../componant/Profile/ProfileContent";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
  <div>
      {loading ? (
        <Loader />
      ) : (
       
          <div className="flex items-start justify-between w-full">
            {/* Sidebar: 1/3 width on desktop */}
            <div className=" h-[100vh] w-[15%] overflow-y-auto sticky top-0">
              <ProfileSideBar />
            </div>

            {/* Content: 2/3 width on desktop */}
            <div className="w-[85%]">
              <ProfileContent active={active} />
            </div>
          </div>
        
      )}
    </div>
  );
};

export default ProfilePage;
