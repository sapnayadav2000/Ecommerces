import requests from "./httpsServices";

const Productservices = {
  updateproduct: async (id, body) => {
    return requests.patch(`/api/product/${id}`, body);
  },
  getproduct: async () => {
    return requests.get(`/api/product/`);
  },
  getProductCategory: async (id,body) => {
    return requests.get(`/api/product/product-list-by-categoryId/${id}`, body)
  },

  getProductSubCategory: async (id,body) => {
    return requests.get(`/api/product/product-list-by-categoryId/${id}`, body)
  },
  
  createproduct: async (body) => {
    return requests.post(`/api/product/`, body);
  },
  deleteproduct: async (id) => {
    return requests.delete(`/api/product/${id}`);
  },
  deleteImage: async (imagePath, productId) => {
    console.log("Sending Data:", { imagePath, productId }); // Debugging
  
    return requests.delete('/api/product/', { 
      data: { imagePath, productId } 
    });
  },
  productsearch:async(body)=>
  {
  return requests.post('/api/product/search',body)
  },
  getProductById:async(id,body)=>
  {
   
    return requests.get(`/api/product/${id}`,body)
  }
  
};

export default Productservices;
