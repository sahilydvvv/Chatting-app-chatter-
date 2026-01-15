import React, { useEffect, useState } from "react";
import { getAllUsers } from "../api/user.api";
import { createConversation } from "../api/conversation.api";
import Avatar from "./Avatar";

const UserList = ({ setActiveConversation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.log("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const conversation = await createConversation(userId);
      setActiveConversation(conversation);
    } catch (error) {
      console.log("Error creating conversation", error);
    }
  };

  return (
    <div className="h-full bg-white">
      {users.length === 0 && (
        <div className="text-center text-gray-400 mt-10 text-sm">
          No users found
        </div>
      )}
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <Avatar name={user.name} image={user.profilePicture} />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm">{user.name}</h4>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium hover:bg-blue-100 transition">
            Message
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
