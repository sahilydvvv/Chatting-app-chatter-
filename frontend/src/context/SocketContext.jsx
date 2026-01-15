import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuth, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuth || !user) return;

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("join_user", user._id || user.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isAuth]);

  const joinRoom = (conversationId) => {
    if (!socket) return;
    socket.emit("join_room", conversationId);
  };

  return (
    <SocketContext.Provider value={{ socket, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
