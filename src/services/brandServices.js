import requests from "./httpsServices";

const BrandService = {
 
  getbrand: async () => {
    return requests.get(`/api/brand/`);
  },
  updatebrand: async (id, body) => {
    return requests.patch(`/api/brand/${id}`, body);
  },
  createbrand: async (body) => {
    console.log(body);
    return requests.post(`/api/brand/`, body);
  },
  deletebrand: async (id) => {
    return requests.delete(`/api/brand/${id}`);
  },
};
export default BrandService;
