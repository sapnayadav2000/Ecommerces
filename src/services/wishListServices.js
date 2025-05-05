import requests from "./httpsServices";

const wishListServices = {
  getAllWishList: async (token) => {
    try {
      const response = await requests.get("/api/wishlist/", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching all wishlists:", error);
      throw error; // Or return a default value or error object
    }
  },

  addToWishlist: async (userId, productId, token) => {
    console.log("TOKEN FROM LOCAL STORAGE:", token);
    return requests.post(
      `/api/wishlist/${userId}`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  removeFromWishlist: async (userId, productId, token) => {
    return requests.delete(`/api/wishlist/${userId}/remove/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getWishlistCount: async (userId) => {
    const token = localStorage.getItem("token");
    return requests.get(`/api/wishlist/count/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getUserWishlist: async (userId) => {
    return requests.get(`/api/wishlist/${userId}`);
  },
};
export default wishListServices;
