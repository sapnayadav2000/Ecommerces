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
        <h2 className="mb-4">Request a Return</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Reason for Return</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {returnReasons.map((reason, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", position: "relative" }}>
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
                    style={{
                      fontSize: "16px",
                      color: "#333",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        content: '""',
                        display: "inline-block",
                        width: "18px",
                        height: "18px",
                        marginRight: "10px",
                        border: "2px solid #ccc",
                        borderRadius: "50%",
                        backgroundColor: selectedReason === reason ? "#28a745" : "#f5f5f5",
                        position: "relative",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {selectedReason === reason && (
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          ✔
                        </span>
                      )}
                    </span>
                    {reason}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Additional Comments (Optional)</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-danger">
            Submit Return Request
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ReturnRequest;
