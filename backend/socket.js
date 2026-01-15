const initSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (conversationId) => {
      socket.join(conversationId);
      console.log("Joined room:", conversationId);
    });

    socket.on("join_user", (userId) => {
      socket.join(userId);
      console.log("User joined personal room:", userId);
    });

    socket.on("typing", ({ conversationId, senderName }) => {
      socket.to(conversationId).emit("typing", senderName);
    });

    socket.on("stopTyping", (conversationId) => {
      socket.to(conversationId).emit("stopTyping");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default initSocketIO;
