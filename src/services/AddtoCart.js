import requests from "./httpsServices";

const AddtoCartServices = {
  getAllCart: async () => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
  
    try {
      const res = await requests.get(`/api/cart`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        params: {
          ...(sessionId && !token && { sessionId }), // only send sessionId if user is not logged in
        },
      });
  
      console.log("getAllCart() response:", res);
      return res;
    } catch (error) {
      console.error("getAllCart() error:", error);
      throw error;
    }
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
getCartCount: async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const sessionId = localStorage.getItem("sessionId");

  const config = {
    headers: {},
    params: {},
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (user?._id) {
    config.params.userId = user._id;
  } else if (sessionId) {
    config.params.sessionId = sessionId;
  }

  return requests.get(`/api/cart`, config);
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

  mergeCartToUser: async (sessionId, userId) => {
    try {
      
      const response = await requests.post(`/api/cart/merge`, {
        sessionId,
        userId,
      });
      console.log("mergeCartToUser() response:", response);
      return response;
    } catch (error) {
      console.error("mergeCartToUser() error:", error);
      throw error;
    }
  },
  
};

export default AddtoCartServices;
