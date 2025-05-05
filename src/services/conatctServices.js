import requests from "./httpsServices";
const Conatct = {

    createContact: async (body) => {
        const token = localStorage.getItem("token");
        return requests.post(`/api/contact/`, body,  {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
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