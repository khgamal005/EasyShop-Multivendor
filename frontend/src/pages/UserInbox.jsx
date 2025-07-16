import { useEffect, useRef, useState } from "react";
import { server } from "../server";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {  useLocation, useOutletContext } from "react-router-dom";

import {
  getConversations,
  updateLastMessage,
} from "../redux/slices/conversationSlice";
import { createMessage, getMessages } from "../redux/slices/messageSlice";
import MessageList from "../components/userInbox/MessageList";
import SellerInbox from "../components/userInbox/SellerInbox";

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
    if (socket) {
      socket.on("getUsers", (users) => {
        console.log("🟢 Received online users:", users);
        setOnlineUsers(users); // ✅ Save in local state
      });

      return () => socket.off("getUsers");
    }
  }, [socket]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((m) => m !== user?._id);
    return onlineUsers.some((u) => u.userId === chatMember);
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
 
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
      
        const receiverId = currentChat.members.find((m) => m !== user._id);
        socket.emit("sendMessage", { ...savedMessage, receiverId });

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
        />
      )}
    </div>
  );
};




export default UserInbox;
