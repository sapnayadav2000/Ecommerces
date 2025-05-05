import requests from "./httpsServices";
import axios from "axios";
const AddressServices = {
  getByIdAdress: async (id) => {
    return requests.get(`/api/address/${id}`);
  },
  getAddress: async () => {
    const token = localStorage.getItem("token"); // or sessionStorage, depending on where you store it
    return requests.get(`/api/address/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateAddress: async (id, body) => {
    return requests.patch(`/api/address/${id}`, body);
  },
  createAddress: async (body) => {
    const token = localStorage.getItem("token");
    console.log("Token used in request:", token);
    console.log(body);
    return  requests.post(`/api/address/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteAddress: async (id) => {
    const token = localStorage.getItem("token");
    return requests.delete(`/api/address/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
export default AddressServices;
