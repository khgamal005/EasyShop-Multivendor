import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useOutletContext } from "react-router-dom";

import {
  getConversations,
  updateLastMessage,
} from "../../redux/slices/conversationSlice";
import { createMessage, getMessages } from "../../redux/slices/messageSlice";
import SellerInbox from "../../componant/Shop/SellerInbox";
import MessageList from "../../componant/Shop/MessageList";

const ShopInboxPage = () => {
  const { seller, isLoading } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
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
    if (socket) {
      socket.on("getUsers", (users) => {
        console.log("🟢 Received online users:", users);
        setOnlineUsers(users); // ✅ Save in local state
      });

      return () => socket.off("getUsers");
    }
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
    if (!seller?._id) return;

    dispatch(getConversations({ id: seller._id, role: "seller" })).then(
      (res) => {
        const convoList = res.payload;
        setConversations(convoList);

        if (conversationIdFromURL) {
          const matched = convoList.find(
            (c) => c._id === conversationIdFromURL
          );
          if (matched) {
            setCurrentChat(matched);
            setOpen(true);
            const otherUserId = matched.members.find((id) => id !== seller._id);
            axios
              .get(`${server}/user/getuser/${otherUserId}`)

              .then((res) => setUserData(res.data.seller))
              .catch(console.error);
          }
        }
      }
    );
  }, [seller?._id, dispatch]);

  // get messages
  useEffect(() => {
    if (currentChat?._id) {
      dispatch(getMessages(currentChat._id)).then((res) => {
        if (res.payload) setMessages(res.payload);
      });
    }
  }, [currentChat?._id, dispatch]);

  const onlineCheck = (chat) => {
    const chatMember = chat.members.find((m) => m !== seller?._id);
    return onlineUsers.some((u) => u.sellerId === chatMember);
  };

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const resultAction = await dispatch(createMessage(messageData));
      const savedMessage = resultAction.payload;

      if (savedMessage) {
        setMessages((prev) => [...prev, savedMessage]);
        setNewMessage("");

        const receiverId = currentChat.members.find((m) => m !== seller._id);
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

  //   e.preventDefault();

  //   const message = {
  //     sender: seller._id,
  //     text: newMessage,
  //     conversationId: currentChat._id,
  //   };

  //   const receiverId = currentChat.members.find(
  //     (member) => member.id !== seller._id
  //   );

  //   socketId.emit("sendMessage", {
  //     senderId: seller._id,
  //     receiverId,
  //     text: newMessage,
  //   });

  //   try {
  //     if (newMessage !== "") {
  //       await axios
  //         .post(`${server}/message/create-new-message`, message)
  //         .then((res) => {
  //           setMessages([...messages, res.data.message]);
  //           updateLastMessage();
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const updateLastMessage = async () => {
  //   socketId.emit("updateLastMessage", {
  //     lastMessage: newMessage,
  //     lastMessageId: seller._id,
  //   });

  //   await axios
  //     .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
  //       lastMessage: newMessage,
  //       lastMessageId: seller._id,
  //     })
  //     .then((res) => {
  //       console.log(res.data.conversation);
  //       setNewMessage("");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open ? (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                setUserData={setUserData}
                userData={userData}
              online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
                isLoading={isLoading}
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
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};
export default ShopInboxPage;

