import React, { useEffect, useState } from "react";
import { getMessages } from "../api/message.api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversationId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { joinRoom, socket } = useSocket();
  const scrollRef = React.useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    joinRoom(conversationId);

    const fetchMessages = async () => {
      try {
        const data = await getMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.log("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, [conversationId]);


  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      if (conversationId && message.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [socket, conversationId]);

  return (
    <div className="flex flex-col h-full">

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {messages.map((msg) => {
          const isMe = (msg.sender._id || msg.sender) === (user._id || user.id || user.user?._id);
          return (
            <div
              key={msg._id}
              className={`max-w-[70%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                isMe
                  ? "bg-blue-600 text-white self-end rounded-br-none"
                  : "bg-white text-gray-800 self-start rounded-bl-none border"
              }`}
            >
              {msg.content}
            </div>
          );
        })}
      </div>


      <MessageInput
        conversationId={conversationId}
        receiverId={receiverId}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatWindow;
