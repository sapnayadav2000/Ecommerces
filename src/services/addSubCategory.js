import requests from "./httpsServices";

const SubCategoryServices = {
 
  getSubCategory: async () => {
    return requests.get(`/api/subcategory/`);
  },
  updateSubCategory: async (id, body) => {
    return requests.patch(`/api/subcategory/${id}`, body);
  },
  createSubCategory: async (body) => {
    return requests.post(`/api/subcategory/`, body);
  },
  deletesubCategory: async (id) => {
    return requests.delete(`/api/subcategory/${id}`);
  },
  getSubCategoryByCategory:async(id,body)=>
  {
    return requests.get(`/api/product/subCategories/${id}`,body);
  }
};

export default SubCategoryServices;
