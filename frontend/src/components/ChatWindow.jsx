import React, { useEffect, useState, useRef } from "react";
import { getMessages, markAsRead } from "../api/message.api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import MessageInput from "./MessageInput";
import Avatar from "./Avatar";

const ChatWindow = ({ conversationId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { joinRoom, socket } = useSocket();
  const scrollRef = useRef();
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    joinRoom(conversationId);
    markAsRead(conversationId);

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

    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on("receiveMessage", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, conversationId]);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Avatar name={receiver?.name} image={receiver?.profilePicture} size="md" />
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-none">
              {receiver?.name || "User"}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1 truncate max-w-md">
              {isTyping ? (
                <span className="text-blue-500 font-semibold animate-pulse">
                  Typing...
                </span>
              ) : (
                receiver?.bio || "No bio available"
              )}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col custom-scrollbar"
      >
        {messages.map((msg) => {
          const isMe =
            (msg.sender._id || msg.sender) === (user._id || user.id);
            
          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 max-w-[80%] ${
                isMe ? "self-end flex-row-reverse" : "self-start"
              }`}
            >
              {!isMe && (
                <div className="mb-1">
                  <Avatar name={receiver?.name} image={receiver?.profilePicture} size="sm" />
                </div>
              )}
              
              <div
                className={`px-4 py-2 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  isMe
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-4 border-t">
        <MessageInput
          conversationId={conversationId}
          receiverId={receiver?._id}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
