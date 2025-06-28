// UserInbox.js
import  { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import { server } from "../server";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../styles/styles";
import { getConversations } from "../redux/slices/conversationSlice";
import { io } from "socket.io-client";
import { useOutletContext } from "react-router-dom";

const ENDPOINT = API_BASE_URL;
const socket = io(ENDPOINT, { transports: ["websocket"] });

const UserInbox = () => {
  const { user, loading } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [images, setImages] = useState();
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { socket } = useOutletContext();

  useEffect(() => {
    socket.emit("someEvent");

    return () => {
      socket.off("someEvent");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (!user?._id) return;
    dispatch(getConversations({ id: user._id, role: "user" }));
  }, [dispatch, user?._id, messages]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (data) => setOnlineUsers(data));
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    return onlineUsers.some((u) => u.userId === chatMembers);
  };

  useEffect(() => {
    const getMessage = async () => {
      if (!currentChat?._id) return;
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find((m) => m !== user._id);

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        `${server}/message/create-new-message`,
        message
      );
      setMessages([...messages, res.data.message]);
      setNewMessage("");
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: newMessage,
          lastMessageId: user._id,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const imageData = reader.result;
        const receiverId = currentChat.members.find((m) => m !== user._id);
        socket.emit("sendMessage", {
          senderId: user._id,
          receiverId,
          images: imageData,
        });

        try {
          const res = await axios.post(`${server}/message/create-new-message`, {
            images: imageData,
            sender: user._id,
            text: "",
            conversationId: currentChat._id,
          });
          setMessages([...messages, res.data.message]);
          await axios.put(
            `${server}/conversation/update-last-message/${currentChat._id}`,
            {
              lastMessage: "Photo",
              lastMessageId: user._id,
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full">
      {!open ? (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                key={index}
                data={item}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user?._id}
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
  index,
  setOpen,
  setCurrentChat,
  me,
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
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [me, data]);

  return (
    <div
      className="w-full flex p-3 px-3 cursor-pointer hover:bg-[#00000010]"
      onClick={() => {
        setOpen(true);
        setCurrentChat(data);
        setUserData(user);
        setActiveStatus(online);
        navigate(`/inbox?${data._id}`);
      }}
    >
      <div className="relative">
        <img
          src={user?.avatar?.url}
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
            : userData?.name?.split(" ")[0] + ":"}{" "}
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
            src={userData?.avatar?.url}
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
        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
              ref={scrollRef}
            >
              {item.sender !== sellerId && (
                <img
                  src={userData?.avatar?.url}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              {item.images && (
                <img
                  src={item.images?.url || item.images}
                  className="w-[300px] h-[300px] object-cover rounded-[10px] ml-2 mb-2"
                  alt=""
                />
              )}
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
