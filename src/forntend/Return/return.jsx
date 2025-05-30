import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { toast } from "react-toastify";
import ReturnServices from "../../services/returnServices"; // Create this
import "@fortawesome/fontawesome-free/css/all.min.css";

const ReturnRequest = () => {
  const { id: orderProductId } = useParams();
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");  // Store selected reason
  const [description, setComments] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // List of predefined reasons for return
  const returnReasons = [
    "Damaged product",
    "Incorrect item received",
    "Size/fit issue",
    "Other",
  ];

  const handleReasonChange = (e) => {
    setSelectedReason(e.target.value);  // Set the selected reason
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReason.trim()) {
      toast.error("Please select a reason for the return");
      return;
    }

    const payload = {
      orderId: orderProductId, // or derive it from context
      orderProductId,
      userId: user?._id,
      reason: selectedReason,  // Send the selected reason
      description,
    };

    try {
      await ReturnServices.createReturn(payload);
      toast.success("Return request submitted");
      navigate("/Your-Orders");
    } catch (err) {
      toast.error("Failed to submit return request");
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="container py-5">
        <div className="p-4 rounded-4 shadow-lg" style={{ backgroundColor: "#ffffff" }}>
          <h2 className="mb-4 text-center" style={{ fontWeight: "600", fontSize: "2rem" }}>
            Request a Return
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold">Reason for Return</label>
              <div className="d-flex flex-column gap-3">
                {returnReasons.map((reason, index) => (
                  <div key={index} className="position-relative d-flex align-items-center">
                    <input
                      type="radio"
                      id={`reason-${index}`}
                      name="returnReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={handleReasonChange}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor={`reason-${index}`}
                      className="return-reason-label p-3 w-100 rounded-3 shadow-sm"
                      style={{
                        border: selectedReason === reason ? "2px solid #28a745" : "1px solid #ccc",
                        backgroundColor: selectedReason === reason ? "#eaf9f0" : "#f9f9f9",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span
                        className="me-3 d-inline-block"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "2px solid #ccc",
                          backgroundColor: selectedReason === reason ? "#28a745" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {selectedReason === reason && "✔"}
                      </span>
                      {reason}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Additional Comments (Optional)</label>
              <textarea
                className="form-control rounded-3 shadow-sm"
                rows="4"
                value={description}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write any extra details here..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-lg px-4 "
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  borderRadius: "10px",
                  fontWeight: "600",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "background-color 0.3s ease",
                }}
              >
                Submit Return Request
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnRequest;



// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import HomeHeader from "../HomeHeader";
// import Footer from "../Footer";
// import { toast } from "react-toastify";
// import ReturnServices from "../../services/returnServices";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const ReturnRequest = () => {
//   // Extract both orderId and orderProductId from the URL params
//   const { orderId, orderProductId } = useParams();
//   const navigate = useNavigate();
//   const [selectedReason, setSelectedReason] = useState("");
//   const [description, setComments] = useState("");
//   const [existingReturn, setExistingReturn] = useState(null);

//   const user = JSON.parse(localStorage.getItem("user"));

//   const returnReasons = [
//     "Damaged product",
//     "Incorrect item received",
//     "Size/fit issue",
//     "Other",
//   ];

//   const handleReasonChange = (e) => {
//     setSelectedReason(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedReason.trim()) {
//       toast.error("Please select a reason for the return");
//       return;
//     }

//     const payload = {
//       orderId,             // Correct orderId from URL
//       orderProductId,      // Correct orderProductId from URL
//       userId: user?._id,
//       reason: selectedReason,
//       description,
//     };

//     try {
//       await ReturnServices.createReturn(payload);
//       toast.success("Return request submitted");
//       navigate("/Your-Orders");
//     } catch (err) {
//       toast.error("Failed to submit return request");
//     }
//   };

//   useEffect(() => {
//     const fetchReturn = async () => {
//       try {
//         // Fetch return data by orderProductId
//         const res = await ReturnServices.getReturnByOrderProductId(orderProductId);
//         console.log("Fetched return response:", res);

//         // Adjust to your API response structure
//         const returnData = res?.data?.data || res?.data;
//         if (returnData) {
//           setExistingReturn({ ...returnData });
//           setSelectedReason(returnData.reason);
//           setComments(returnData.description);
//         }
//       } catch (error) {
//         console.log("No existing return or error:", error.message);
//       }
//     };

//     fetchReturn();
//   }, [orderProductId]);

//   return (
//     <>
//       <HomeHeader />
//       <div className="container py-5">
//         <div className="p-4 rounded-4 shadow-lg bg-white">
//           <h2 className="mb-4 text-center fw-bold fs-2">Request a Return</h2>

//           {existingReturn && (
//             <div className="alert alert-info">
//               <p className="mb-1 fw-semibold">
//                 You’ve already submitted a return request for this item.
//               </p>
//               <p className="mb-1"><strong>Reason:</strong> {existingReturn.reason}</p>
//               <p className="mb-1"><strong>Comments:</strong> {existingReturn.description || "None"}</p>
//               <p className="mb-0"><strong>Status:</strong> {existingReturn.status}</p>

//               {/* Debug info - remove later */}
//               <pre className="mt-3 bg-light p-2 rounded">{JSON.stringify(existingReturn, null, 2)}</pre>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="form-label fw-semibold">Reason for Return</label>
//               <div className="d-flex flex-column gap-3">
//                 {returnReasons.map((reason, index) => (
//                   <div key={index} className="position-relative d-flex align-items-center">
//                     <input
//                       type="radio"
//                       id={`reason-${index}`}
//                       name="returnReason"
//                       value={reason}
//                       checked={selectedReason === reason}
//                       onChange={handleReasonChange}
//                       style={{ display: "none" }}
//                       disabled={!!existingReturn}
//                     />
//                     <label
//                       htmlFor={`reason-${index}`}
//                       className="return-reason-label p-3 w-100 rounded-3 shadow-sm"
//                       style={{
//                         border: selectedReason === reason ? "2px solid #28a745" : "1px solid #ccc",
//                         backgroundColor: selectedReason === reason ? "#eaf9f0" : "#f9f9f9",
//                         cursor: existingReturn ? "not-allowed" : "pointer",
//                       }}
//                     >
//                       <span
//                         className="me-3 d-inline-block"
//                         style={{
//                           width: "20px",
//                           height: "20px",
//                           borderRadius: "50%",
//                           border: "2px solid #ccc",
//                           backgroundColor: selectedReason === reason ? "#28a745" : "#fff",
//                           color: "white",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                         }}
//                       >
//                         {selectedReason === reason && "✔"}
//                       </span>
//                       {reason}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="form-label fw-semibold">Additional Comments (Optional)</label>
//               <textarea
//                 className="form-control rounded-3 shadow-sm"
//                 rows="4"
//                 value={description}
//                 onChange={(e) => setComments(e.target.value)}
//                 disabled={!!existingReturn}
//               />
//             </div>

//             <div className="text-center">
//               <button
//                 type="submit"
//                 className="btn btn-lg px-4"
//                 style={{
//                   backgroundColor: "#dc3545",
//                   color: "#fff",
//                   borderRadius: "10px",
//                   fontWeight: "600",
//                 }}
//                 disabled={!!existingReturn}
//               >
//                 Submit Return Request
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ReturnRequest;
