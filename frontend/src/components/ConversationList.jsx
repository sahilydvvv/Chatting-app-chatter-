import React, { useEffect, useState } from "react";
import { getConversations } from "../api/conversation.api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import Avatar from "./Avatar";

const ConversationList = ({ setActiveConversation, activeConversationId }) => {
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
            const isCurrentConversation =
              String(conv._id) === String(activeConversationId);
            const isMe = String(message.sender) === String(user._id) || String(message.sender?._id) === String(user._id);
            
            return {
              ...conv,
              lastMessage: message,
              unreadCount: (isCurrentConversation || isMe)
                ? 0
                : (Number(conv.unreadCount) || 0) + 1,
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
    <div className="h-full bg-white">
      {conversations.length === 0 && (
        <div className="text-center text-gray-400 mt-10 text-sm">
          No conversations yet
        </div>
      )}
      {conversations.map((conversation) => {
        const otherUser = conversation.participants.find(
          (p) => p._id !== user._id
        );
        const unreadCount = conversation.unreadCount || 0;

        return (
          <div
            key={conversation._id}
            onClick={() => {
              setConversations((prev) =>
                prev.map((c) =>
                  c._id === conversation._id ? { ...c, unreadCount: 0 } : c
                )
              );
              handleClick(conversation);
            }}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Avatar name={otherUser?.name} image={otherUser?.profilePicture} />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {otherUser?.name || "Unknown User"}
                </h4>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className={`text-xs truncate ${unreadCount > 0 ? "font-bold text-gray-800" : "font-medium text-gray-500"}`}>
                {conversation.lastMessage?.content || (
                  <span className="italic">No messages yet</span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
