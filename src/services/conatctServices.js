import requests from "./httpsServices";
const Conatct = {

    createContact: async (body) => {
      
        return requests.post(`/api/contact/`, body);
      },
      getConatct: async () => {
        return requests.get(`/api/contact/`);
      },

      updatedContact: async (id, data) => {
           
        return await requests.patch(`/api/contact/${id}`,data);
      },
      DeleteContact: async (id) => {
            
        return await requests.delete(`/api/contact/${id}`);
      },
};
export default Conatct;