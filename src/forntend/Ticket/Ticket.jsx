import React, { useState } from "react";
import { toast } from "react-toastify";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import TicketServices from "../../services/ticketServices";
import { useParams } from "react-router-dom";

const Ticket = () => {
  const { orderProductId } = useParams();
  
  const userId = localStorage.getItem("userId"); // Get userId from storage
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({
    orderProductId: orderProductId, 
    userId: "",
    TicketId: "",
    Issue_type: "",
    mobileno: "",
    image: null, // State for storing selected image
  });

  const [imagePreview, setImagePreview] = useState(null); // For image preview

  console.log("Order Product ID from URL:", orderProductId);
  if (userId) {
    formData.userId = userId; // Set userId from localStorage
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    
    // Preview the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Store image preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate Mobile Number
  const validateMobile = (mobileno) => {
    return /^[0-9]{10}$/.test(mobileno); // Checks for a 10-digit mobile number
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateMobile(formData.mobileno)) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    // Prepare form data with the image file (if any)
    const ticketFormData = new FormData();
    ticketFormData.append("orderProductId", formData.orderProductId);
    ticketFormData.append("userId", formData.userId);
    ticketFormData.append("mobileno", formData.mobileno);
    ticketFormData.append("Issue_type", formData.Issue_type);
    if (formData.image) {
      ticketFormData.append("file", formData.image); // Append image
    }

    try {
      // Submit the form data to the backend using FormData
      const response = await TicketServices.createticket(ticketFormData);

      console.log('response', response);
      // Assuming successful response returns the ticket
      if (response) {
        toast.success("Ticket submitted successfully!");
        setFormData({
          userId: "",
          TicketId: "",
          Issue_type: "",
          mobileno: "",
          image: null, // Reset image after submission
        });
        setImagePreview(null); // Reset image preview
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  // Triggering a phone call to the support number
  const handleCallSupport = () => {
    const supportNumber = "+1234567890"; // Replace with actual support number
    window.location.href = `tel:${supportNumber}`;
  };

  // Open the modal
  const handleContactSupport = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Modal styles
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  };

  const buttonStyle = {
    backgroundColor: "#3498db",
    color: "white",
    padding: "14px 20px",
    border: "none",
    borderRadius: "4px",
    fontSize: "1em",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s",
    marginBottom: "10px",
  };

  return (
    <>
      <HomeHeader />
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.8em",
            color: "#2c3e50",
            marginBottom: "20px",
          }}
        >
          Submit a Support Ticket
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "1em",
                color: "#7f8c8d",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Issue Type
            </label>
            <input
              type="text"
              name="Issue_type"
              value={formData.Issue_type}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1em",
                boxSizing: "border-box",
                transition: "border 0.3s",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "1em",
                color: "#7f8c8d",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileno"
              value={formData.mobileno}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1em",
                boxSizing: "border-box",
                transition: "border 0.3s",
              }}
              required
            />
          </div>

          {/* <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "1em",
                color: "#7f8c8d",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Upload Image (Optional)
            </label>
        
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1em",
                boxSizing: "border-box",
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <img src={imagePreview} alt="Image Preview" style={{ maxWidth: "100%", height: "auto" }} />
              </div>
            )}
          </div> */}

          <button type="submit" style={buttonStyle}>
            Submit Ticket
          </button>
        </form>

        <button
          onClick={handleContactSupport}
          style={{
            ...buttonStyle,
            backgroundColor: "#27ae60",
            marginTop: "20px",
          }}
        >
          Contact Support
        </button>
      </div>

      {/* Modal for contacting support */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>How would you like to contact support?</h3>
            <button
              onClick={handleCallSupport}
              style={{ ...buttonStyle, backgroundColor: "#3498db" }}
            >
              Call Support
            </button>

            <button
              onClick={closeModal}
              style={{
                ...buttonStyle,
                backgroundColor: "#e74c3c",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Ticket;
