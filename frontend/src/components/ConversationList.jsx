import React, { useEffect, useState } from "react";
import { getConversations } from "../api/conversation.api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const ConversationList = ({ setActiveConversation }) => {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data.conversations);
      } catch (error) {
        console.log("error fetching conversations", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      setConversations((prev) => {
        const conversationExists = prev.find(
          (conv) => String(conv._id) === String(message.conversationId)
        );

        if (!conversationExists) {
          getConversations()
            .then((data) => setConversations(data.conversations))
            .catch((err) => console.log("Error fetching new conversation", err));
          return prev;
        }

        return prev.map((conv) => {
          if (String(conv._id) === String(message.conversationId)) {
            return {
              ...conv,
              lastMessage: message,
            };
          }
          return conv;
        });
      });
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [socket]);

  const handleClick = (conversation) => {
    setActiveConversation(conversation);
  };

  return (
    <div className="h-full overflow-y-auto bg-white border-r">
      {conversations.map((conversation) => {
        const otherUser = conversation.participants.find(
          (p) => p._id !== user._id
        );

        return (
          <div
            key={conversation._id}
            onClick={() => handleClick(conversation)}
            className="px-4 py-3 border-b cursor-pointer hover:bg-gray-100"
          >
            <div className="font-semibold">
              {otherUser?.name}
            </div>

            <div className="text-sm text-gray-500 truncate">
              {conversation.lastMessage?.content || "No messages yet"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
