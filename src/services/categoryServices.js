import requests from "./httpsServices";

const CategoryServices = {
 
  getCategory: async () => {
    return requests.get(`/api/category/`);
  },
  updateCategory: async (id, body) => {
    return requests.patch(`/api/category/${id}`, body);
  },
  createCategory: async (body) => {
    return requests.post(`/api/category/`, body);
  },
  deleteCategory: async (id) => {
    return requests.delete(`/api/category/${id}`);
  },
};
export default CategoryServices;
