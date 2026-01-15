import api from "./axios.js";

export const createConversation = async (receiverId) => {
  try {
    const response = await api.post("/conversations", { receiverId });
    return response.data;
  } catch (error) {
    console.log("error creating conversation", error);
    throw error;
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get("/conversations");
    return response.data;
  } catch (error) {
    console.log("error getting conversations", error);
    throw error;
  }
};
