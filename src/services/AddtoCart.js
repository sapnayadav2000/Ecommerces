import requests from "./httpsServices";

const AddtoCartServices = {
  getAllCart: async () => {
    const token = localStorage.getItem("token");
    const res = await requests.get(`/api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getAllCart() response:", res); // <== Check this
    return res;
  },
  addToCart: async (body, token) => {
    const response = await requests.post(`/api/cart/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response; // ✅ Make sure you're returning the response!
  },
  removeFromCartItem: async (cartId, itemId) => {
    const token = localStorage.getItem("token");
    return requests.delete(`/api/cart/${cartId}/item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getCartById: async (id) => {
    const token = localStorage.getItem("token");
    return requests.get(`/api/cart/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getCartCountByUserId: async (userId) => {
    const token = localStorage.getItem("token");
    return requests.get(`/api/cart?user=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateQuantity: async (cartId, itemId, quantity) => {
    const token = localStorage.getItem("token");
    try {
      // Using GET with query parameters to update quantity
      const response = await requests.get(
        `/api/cart/${cartId}/item/${itemId}?quantity=${quantity}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating quantity", error);
      throw error;
    }
  },
};
export default AddtoCartServices;
