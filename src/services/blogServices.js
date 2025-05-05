import requests from "./httpsServices";

const BlogService = {
 
  getBlogById:async(id)=>
  {
    return requests.get(`/api/blog/${id}`);
  },
  getblog: async () => {
    return requests.get(`/api/blog/`);
  },
  updateblog: async (id, body) => {
    return requests.patch(`/api/blog/${id}`, body);
  },
  createblog: async (body) => {
    console.log(body);
    return requests.post(`/api/blog/`, body);
  },
  deletebrand: async (id) => {
    return requests.delete(`/api/blog/${id}`);
  },
};
export default BlogService;
