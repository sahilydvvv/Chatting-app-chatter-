import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../api/message.api";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const MessageInput = ({ conversationId, receiverId, setMessages }) => {
  const [text, setText] = useState("");
  const { socket } = useSocket();
  const { user } = useAuth();
  const typingTimeoutRef = useRef(null);

  const handleTyping = () => {
    if (!socket || !conversationId) return;
    socket.emit("typing", { conversationId, senderName: user?.name });

    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", conversationId);
    }, 2000);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    if (!conversationId || !receiverId) {
      console.log("Missing ID");
      return;
    }

    try {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        socket.emit("stopTyping", conversationId);
      }

      setText("");
      await sendMessage({
        conversationId,
        receiverId,
        content: text,
      });
    } catch (error) {
      console.log("Error sending message", error);
      alert(
        "Failed to send message: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    handleTyping();
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
        className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className={`p-3 rounded-full transition-colors ${
          text.trim()
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 translate-x-0.5 translate-y-px"
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;
