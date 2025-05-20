import requests from "./httpsServices";
const trackOrder = async (userId, orderId, orderProductId) => {
  return await requests.get(`/api/Orders/track/${userId}/${orderId}/${orderProductId}`);
};
const OrderServices = {
updateOrderStatus: (orderId, productId, data) => {
   const token = localStorage.getItem("token");
  return requests.patch(`/api/orders/update-status/${orderId}/${productId}`, data, {
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
cancelProductInOrder: async (orderId, productId) => {
  const token = localStorage.getItem("token");
  return requests.delete(`/api/Orders/${orderId}/${productId}`, {
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
