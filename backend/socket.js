const initSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (conversationId) => {
      socket.join(conversationId);
      console.log("Joined room:", conversationId);
    });

    // socket.on("sendMessage", (message) => {
    //   const { conversationId } = message;

    //   socket.to(conversationId).emit("receiveMessage", message);
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default initSocketIO;
