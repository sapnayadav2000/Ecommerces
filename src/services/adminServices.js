
import requests from "./httpsServices";

const AdminServices = {
  login: async (body) => {
    console.log(body);
    return requests.post(`/api/admin/login`, body);
  },

  dashboard: async () => {
    return requests.get(`/api/admin/dashboard`);
  },
  updatePassword : async (body) =>{
    return requests.patch(`/api/admin/change-password`,body);
},
    createAdmin : async (body) =>{
      return requests.post(`/api/admin/register`,body);
    },
    updateProfile:async(id,body)=>{
      return requests.patch(`/api/admin/${id}`, body);
    },
    getMyProfile : async () =>{
      return requests.get(`/api/admin/profile`);
  },
  updateMe : async (body) =>{
    return requests.patch(`/api/admin/updateMe`,body);
},
   
};

export default AdminServices;
