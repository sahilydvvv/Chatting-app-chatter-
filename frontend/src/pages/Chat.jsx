import React, { useState } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import UserList from "../components/UserList";
import Avatar from "../components/Avatar";
import EditProfileModal from "../components/EditProfileModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [activeTab, setActiveTab] = useState("chats");
  const [activeConversation, setActiveConversation] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // derived receiver object
  const receiver = (() => {
    if (!activeConversation?.participants) return null;
    const myId = user?._id || user?.id;
    if (!myId) return null;
    return activeConversation.participants.find((p) => {
      const pId = p._id || p;
      return String(pId) !== String(myId);
    });
  })();

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {isEditingProfile && (
        <EditProfileModal onClose={() => setIsEditingProfile(false)} />
      )}

      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-white border-r flex flex-col shadow-sm z-10">
        
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <Avatar name={user?.name} image={user?.profilePicture} size="md" />
              <button
                onClick={() => setIsEditingProfile(true)}
                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow border border-gray-200 hover:bg-gray-100 transition text-gray-500"
                title="Edit Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25v-5.5a.75.75 0 00-1.5 0v5.5a1.25 1.25 0 01-1.25 1.25h-9.5a1.25 1.25 0 01-1.25-1.25v-9.5z" />
                </svg>
              </button>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 leading-tight flex items-center gap-2">
                {user?.name || "Me"}
              </h3>
              <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">
                {user?.bio || "No bio yet"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 hover:border-red-400 px-3 py-1 rounded-full transition"
          >
            Logout
          </button>
        </div>

        <div className="flex p-2 gap-2 bg-gray-50/50">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "chats"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "users"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            People
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "chats" ? (
            <ConversationList
              setActiveConversation={setActiveConversation}
              activeConversationId={activeConversation?._id}
            />
          ) : (
            <UserList setActiveConversation={setActiveConversation} />
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-100 flex flex-col relative">
        {activeConversation && receiver ? (
          <ChatWindow
            conversationId={activeConversation._id}
            receiver={receiver}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-24 h-24 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <p className="text-xl font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
