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
    { 
        return requests.get(`/api/ticket/`) 
    },

    DeleteTicket:async(id,body)=>
    { 
        return requests.delete(`/api/ticket/${id}`,body)
    },

    updatePriority: async (id, body) => {
        
        return requests.patch(`/api/ticket/${id}`, body);
      },


}




export default  TicketServices;


