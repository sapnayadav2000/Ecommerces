import requests from "./httpsServices";

const UserServices = {

    getPrivicyPolicy : async () =>{
        return requests.get(`/api/policy?data=privacyPolicy`);
    },
   
    getabout : async () =>{
        return requests.get(`/api/policy?data=about`);
    },

    updateAppPolicy : async (body) =>{
        return requests.patch(`/api/policy`,body);
    },

    getTermCondition : async () =>{
        return requests.get('/api/policy?data=termsAndCondition');
    },


}

export default UserServices;