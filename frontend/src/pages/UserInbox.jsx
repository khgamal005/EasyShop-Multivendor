import { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { server } from "../server";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
import {
  getConversations,
  updateLastMessage,
} from "../redux/slices/conversationSlice";
import { createMessage, getMessages } from "../redux/slices/messageSlice";
import { getSellerImageUrl, getUserImageUrl } from "../utils/imageHelpers";

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);

  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { socket } = useOutletContext();
  const location = useLocation();

  const conversationIdFromURL = new URLSearchParams(location.search).get(
    "conversationId"
  );

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images || [],
        createdAt: Date.now(),
      });
    });
    return () => socket.off("getMessage");
  }, [socket]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (!user?._id) return;

    dispatch(getConversations({ id: user._id, role: "user" })).then((res) => {
      const convoList = res.payload;
      setConversations(convoList);

      if (conversationIdFromURL) {
        const matched = convoList.find((c) => c._id === conversationIdFromURL);
        if (matched) {
          setCurrentChat(matched);
          setOpen(true);
          const otherUserId = matched.members.find((id) => id !== user._id);
          axios
            .get(`${server}/shop/get-Specific-seller/${otherUserId}`)

            .then((res) => setUserData(res.data.seller))
            .catch(console.error);
        }
      }
    });
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (currentChat?._id) {
      dispatch(getMessages(currentChat._id)).then((res) => {
        if (res.payload) setMessages(res.payload);
      });
    }
  }, [currentChat?._id, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((m) => m !== user?._id);
    return onlineUsers.some((u) => u.userId === chatMember);
  };

const sendMessageHandler = async (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  const messageData = {
    sender: user._id,
    text: newMessage,
    conversationId: currentChat._id,
  };

  try {
    const resultAction = await dispatch(createMessage(messageData));
    const savedMessage = resultAction.payload;

    if (savedMessage) {
      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
      console.log(savedMessage._id); // ✅ Proper logging

      // const receiverId = currentChat.members.find((m) => m !== user._id);
      // socket.emit("sendMessage", { ...savedMessage, receiverId });

      await dispatch(
        updateLastMessage({
          id: currentChat._id,
          lastMessage: savedMessage.text,
          lastMessageId: savedMessage._id,
        })
      );
    }
  } catch (err) {
    console.error("❌ Message send error:", err);
  }
};


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentChat || !user?._id) return;

    const receiverId = currentChat.members.find((m) => m !== user._id);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        socket.emit("sendMessage", {
          senderId: user._id,
          receiverId,
          images: reader.result,
          text: "",
        });
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("images", file);
    formData.append("sender", user._id);
    formData.append("text", "");
    formData.append("conversationId", currentChat._id);

    try {
      const res = await dispatch(createMessage(formData)).unwrap();
      setMessages((prev) => [...prev, res]);
      await dispatch(
        updateLastMessage({
          id: currentChat._id,
          lastMessage: "Photo",
          lastMessageId: user._id,
        })
      );
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="w-full">
      {!open ? (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations.map((item, index) => (
            <MessageList
              key={index}
              data={item}
              me={user?._id}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              setUserData={setUserData}
              userData={userData}
              online={onlineCheck(item)}
              setActiveStatus={setActiveStatus}
              loading={loading}
            />
          ))}
        </>
      ) : (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={user._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

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
        <h1 className="text-[18px]">{user?.name}</h1>
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

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between p-5">
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={getSellerImageUrl(userData?.avatar?.url)}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="px-3 h-[75vh] py-3 overflow-y-scroll">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex w-full my-2 ${
              item.sender === sellerId ? "justify-end" : "justify-start"
            }`}
            ref={scrollRef}
          >
            {item.text !== "" && (
              <div>
                <div
                  className={`w-max p-2 rounded ${
                    item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                  } text-white h-min`}
                >
                  <p>{item.text}</p>
                </div>
                <p className="text-[12px] text-[#000000d3] pt-1">
                  {format(item.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.input}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInbox;
