import api from "./axios.js";


export const sendMessage = async ({ conversationId, content, receiverId }) => {
  try {
    const response = await api.post("/messages", {
      conversationId,
      content,
      receiverId,
    });

    return response.data;
  } catch (error) {
    console.log("error sending message", error);
    throw error;
  }
};


export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.log("error getting messages", error);
    throw error;
  }
};


export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(
      `/messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    console.log("error deleting message", error);
    throw error;
  }
};
