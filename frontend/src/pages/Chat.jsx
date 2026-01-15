import React, { useState } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import UserList from "../components/UserList";
import { useAuth } from "../context/AuthContext";

function Chat() {
  const [activeTab, setActiveTab] = useState("chats");
  const [activeConversation, setActiveConversation] = useState(null);
  const { user } = useAuth();

  return (
    <div className="h-screen flex">
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-3 font-semibold ${
              activeTab === "chats"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-3 font-semibold ${
              activeTab === "users"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Users
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "chats" ? (
            <ConversationList setActiveConversation={setActiveConversation} />
          ) : (
            <UserList setActiveConversation={setActiveConversation} />
          )}
        </div>
      </div>

      <div className="w-2/3 bg-gray-50">
        {activeConversation ? (
          <ChatWindow
            conversationId={activeConversation._id}
            receiverId={(() => {
              if (!activeConversation?.participants) return null;
              
              const myId = user?._id || user?.id;
              if (!myId) return null;

              const other = activeConversation.participants.find((p) => {
                const pId = p._id || p;
                return String(pId) !== String(myId);
              });

              return other?._id || other;
            })()}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
