import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../../server";
import { getSellerImageUrl } from "../../utils/imageHelpers";

const MessageList = ({
  data,
  me,
  setOpen,
  setCurrentChat,
  setUserData,
  userData,
  online,
  setActiveStatus,
  loading,
}) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((u) => u !== me);
    axios
      .get(`${server}/shop/get-Specific-seller/${userId}`)
      .then((res) => setUser(res.data.seller))
      .catch(console.error);
  }, [me, data]);

  return (
    <div
      className="w-full flex p-3 px-3 cursor-pointer hover:bg-[#00000010] bg-amber-300"
      onClick={() => {
        setOpen(true);
        setCurrentChat(data);
        setUserData(user);
        setActiveStatus(online);
        navigate(`/inbox?conversationId=${data._id}`);
      }}
    >
      <div className="relative">
        <img
          src={getSellerImageUrl(user.avatar?.url)}
          alt="avatar"
          className="w-[50px] h-[50px] rounded-full"
        />
        <div
          className={`w-[12px] h-[12px] rounded-full absolute top-[2px] right-[2px] ${
            online ? "bg-green-400" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[18px] flex items-center gap-2">
          {user?.name}
          {online ? (
            <span className="text-green-500 text-[14px]">● Online</span>
          ) : (
            <span className="text-gray-400 text-[14px]">● Offline</span>
          )}
        </h1>
        <p className="text-[16px] text-[#000c]">
          {!loading && data?.lastMessageId !== userData?._id
            ? "You:"
            : `${userData?.name?.split(" ")[0]}:`}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

export default MessageList;
