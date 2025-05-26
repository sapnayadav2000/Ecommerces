import requests from "./httpsServices";

const Return={

     createReturn :async(formData) => {
        return requests.post(`/api/return/request-return`, formData);
    } ,

    getAllReturn :async(formData) => {
        return requests.get(`/api/return/`, formData);
    } ,

    DeleteReturn:async(id)=>
    {
        return requests.delete(`/api/return/${id}`);
    },

    updateReturn:async(id,body)=>
    {
       
        return requests.patch(`/api/return/${id}`,body); 
    },
                getReturnByOrderProductId: async (orderProductId) => {
                return requests.get(`/api/return/order-product/${orderProductId}`);
                }

}


export default Return

