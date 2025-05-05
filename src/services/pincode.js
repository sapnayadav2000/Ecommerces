import requests from "./httpsServices";

const Pincodeservices = {
  updatePincode: async (id, body) => {
    return requests.patch(`/api/pincodes/${id}`, body);
  },
  getPincode: async () => {
   
    return requests.get(`/api/pincodes/`);
  },
 
  createPincode: async (body) => {
    return requests.post(`/api/pincodes`, body);
  },
  deletePincode: async (id) => {
    return requests.delete(`/api/pincodes/${id}`);
  },
  checkPincode: async (pincode) => {
    return requests.post(`/api/pincodes/check-pincode`,{pincode});
  },
};

export default Pincodeservices;
