import  { useState } from "react";
import Header from "../componant/Layout/Header";
import styles from "../styles/styles";
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
        <>

          <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
            <div className="w-2xl 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
              <ProfileSideBar active={active} setActive={setActive} />
            </div>
            <ProfileContent active={active} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
