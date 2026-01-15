import React, { useEffect, useState } from "react";
import { getAllUsers } from "../api/user.api";
import { createConversation } from "../api/conversation.api";

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
    <div className="border-b">
      <h2 className="px-4 py-2 font-semibold">Users</h2>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => handleUserClick(user._id)}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};

export default UserList;
