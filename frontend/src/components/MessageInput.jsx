import React, { useState } from "react";
import { sendMessage } from "../api/message.api";

const MessageInput = ({ conversationId, receiverId, setMessages }) => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    if (!conversationId || !receiverId) {
      console.log("Missing ID");
      return;
    }

    try {
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

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded px-3 py-2"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
