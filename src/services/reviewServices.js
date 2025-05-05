import requests from "./httpsServices";

const Review={

     createReview :async(formData) => {
        const token = localStorage.getItem("token");
        return requests.post(`/api/review/`, formData,{
            headers: {
                Authorization: `Bearer ${token}`,
              }
        } );
    },
    getReviewsByProductId:async(productId)=>
    {
        return await requests.get(`/api/review/product/${productId}`);
    },
    getReviews:async()=>
        {
            return await requests.get(`/api/review/`);
        },
        updateReview: async (id, data) => {
           
            return await requests.patch(`/api/review/${id}`,data);
          },
        
          deleteReview: async (id) => {
            
            return await requests.delete(`/api/review/${id}`);
          },
       
          deleteImage: async (imagePath, reviewId) => {
            console.log("Sending Data:", { imagePath, reviewId }); // Debugging
          
            return requests.delete('/api/review/', { 
              data: { imagePath, reviewId } 
            });
          },

}


export default Review

