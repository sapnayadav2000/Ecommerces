import requests from "./httpsServices";
const UserServices = {
  getMyProfile: async (token) => {
    return requests.get(`/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getAllUser: async () => {
    return requests.get(`/api/user/`);
  },
  getUserById: async (id, body) => {
    return requests.get(`/api/user/${id}`, body);
  },
  UpdatedUser: async (id, body) => {
    const token = localStorage.getItem("token");
    return requests.patch(`/api/user/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteuser: async (id) => {
    const token = localStorage.getItem("token");
    return requests.delete(`/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getLogin: async (user) => {
    return requests.post(`/api/user/login`, user);
  },
  getRegister: async (body) => {
    return requests.post("/api/user/register", body);
  },
  verifyOtp: async (body) => {
    return requests.post("/api/user/verifysignup", body);
  },
};

export default UserServices;
