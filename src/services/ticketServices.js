import requests from "./httpsServices";

const TicketServices={

     createticket:async(body) => {
        const token = localStorage.getItem("token");
        return requests.post(`/api/ticket/`, body,{
            headers: {
                Authorization: `Bearer ${token}`,
              }
        } );
    },
    AllTicket:async()=>
    { const token = localStorage.getItem("authtoken");
        return requests.get(`/api/ticket/`,{
            headers: {
                Authorization: `Bearer ${token}`,
              }
        }) 
    },

    DeleteTicket:async(id,body)=>
    { const token = localStorage.getItem("authtoken");
        return requests.delete(`/api/ticket/${id}`,body,{
            headers: {
                Authorization: `Bearer ${token}`,
              }
        })
    },

    updatePriority: async (id, body) => {
        const token = localStorage.getItem("authtoken");
        return requests.patch(`/api/ticket/${id}`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      },


}




export default  TicketServices;


