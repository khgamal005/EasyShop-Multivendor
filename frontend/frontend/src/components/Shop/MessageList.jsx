import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserImageUrl } from "../../utils/imageHelpers";
import axios from "axios";
import { server } from "../../server";

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  isLoading,
}) => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const [active, setActive] = useState(null);

  useEffect(() => {
    const userId = data.members.find((user) => user !== me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/getuser/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

  const handleClick = () => {
    setActive(index);
    setOpen(true);
    setCurrentChat(data);
    setUserData(user);
    setActiveStatus(online);
    navigate(`/dashboard/inbox?conversationId=${data._id}`);
  };

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      }  cursor-pointer`}
      onClick={handleClick}
    >
      <div className="relative">
        <img
          src={getUserImageUrl(user.avatar?.url)}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        <div
          className={`w-[12px] h-[12px] rounded-full absolute top-[2px] right-[2px] ${
            online ? "bg-green-400" : "bg-[#c7b9b9]"
          }`}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{user?.name}
          {online ? (
            <span className="text-green-500 text-[14px]">● Online</span>
          ) : (
            <span className="text-gray-400 text-[14px]">● Offline</span>
          )}
        </h1>
        <p className="text-[16px] text-[#000c]">
          {!isLoading && data?.lastMessageId !== user?._id
            ? "You:"
            : `${user?.name?.split(" ")[0]}:`}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default MessageList;
