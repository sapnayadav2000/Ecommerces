import requests from "./httpsServices";
const trackOrder = async (userId, orderId) => {
  const res = await requests.get(`/api/Orders/track/${userId}/${orderId}`);
  console.log("response data", res);
  return res;
};
const OrderServices = {
  updateOrder: async (id, body) => {
    const token = localStorage.getItem("token");
    return requests.patch(`/api/order/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getOrders: async (id) => {
    const token = localStorage.getItem("token");
    return requests.get(`/api/Orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAllOrders: async () => {
    const token = localStorage.getItem("token");
    return requests.get(`/api/Orders/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createOrder: async (body, token) => {
    return requests.post(`/api/Orders/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  verifyPayment: async (body, token) => {
    return requests.post(`/api/Orders/verify-payment`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteOrder: async (id) => {
    const token = localStorage.getItem("token");
    return requests.delete(`/api/Orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getUserAddresses: async (userId) => {
    const token = localStorage.getItem("token");
    return requests.get(`/api/user/${userId}/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  trackOrder,
};

export default OrderServices;
