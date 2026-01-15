import api from "./axios";

export const getAllUsers = async () => {
  try {
    const response = await api.get("/auth");
    return response.data;
  } catch (error) {
    console.log("error fetching users", error);
    throw error;
  }
};
