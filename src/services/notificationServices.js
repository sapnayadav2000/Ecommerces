import requests from "./httpsServices";

const Notificationservices = {
  updateNotification: async (id, body) => {
    return requests.patch(`/api/notification/${id}`, body);
  },
  getNotification: async () => {
    return requests.get(`/api/notification/`);
  },
 
  createNotification: async (body) => {
    return requests.post(`/api/notification`, body);
  },
  deleteNotification: async (id) => {
    return requests.delete(`/api/notification/${id}`);
  },
};

export default Notificationservices;
