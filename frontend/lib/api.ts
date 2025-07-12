import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const sendChatMessage = async (userId: string, message: string) => {
  try {
    const response = await api.post("/chat", {
      user_id: userId,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const uploadImage = async (file: File, userId: string) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", userId);

    const response = await api.post("/chat/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const reportIssue = async (userId: string, message: string) => {
  try {
    const response = await api.post("/issue/", {
      user_id: userId,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error("Error reporting issue:", error);
    throw error;
  }
};

export const getIssues = async () => {
  try {
    const response = await api.get("/issue/");
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
};

export const getCartItems = async (userId: string) => {
  const response = await api.get(`/cart/${userId}`);
  return response.data.items;
};

export const updateCartItem = async (
  userId: string,
  item: { name: string; quantity: number }
) => {
  const response = await api.put(`/cart/${userId}/update`, {
    product_name: item.name,
    quantity: item.quantity,
  });
  return response.data.items;
};

export const deleteCartItem = async (userId: string, productName: string) => {
  const encodedName = encodeURIComponent(productName);
  const response = await api.delete(`/cart/${userId}/remove/${encodedName}`);
  return response.data.items;
};
