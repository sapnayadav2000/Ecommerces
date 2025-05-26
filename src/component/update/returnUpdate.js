import React, { useState, useEffect } from "react";
import { FaUser, FaBoxOpen, FaReceipt, FaUndo } from "react-icons/fa";

function ReturnUpdate({ returns, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    reason: "",
    description: "",
  });

  useEffect(() => {
    if (returns) {
      setFormValues({
        reason: returns?.reason || "",
        description: returns?.description || "",
      });
    }
  }, [returns]);

  const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 12px rgba(0,0,0,0.05)",
  };

  const sectionTitle = (Icon, title) => (
    <div className="d-flex align-items-center mb-3">
      <Icon className="me-2 text-primary" />
      <h6 className="mb-0">{title}</h6>
    </div>
  );

  return (
    <div className="modal fade show d-block" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div className="modal-content rounded-4">
          <div className="modal-header bg-light border-0">
            <h5 className="modal-title fw-bold">Return Request Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
              aria-label="Close"
            />
          </div>

          <div className="modal-body px-4 py-3">
            {/* USER INFO */}
            <div style={cardStyle}>
              {sectionTitle(FaUser, "User Information")}
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {returns?.userId?.name}</p>
                  <p><strong>Email:</strong> {returns?.userId?.email}</p>
                  <p><strong>Mobile:</strong> {returns?.userId?.mobileNo}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Address:</strong></p>
                  <p>{returns?.userId?.address}, {returns?.userId?.city}, {returns?.userId?.state} - {returns?.userId?.pincode}</p>
                </div>
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div style={cardStyle}>
              {sectionTitle(FaBoxOpen, "Product Information")}
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Name:</strong> {returns?.orderProductId?.productId?.name}</p>
                  <p><strong>Size:</strong> {returns?.orderProductId?.size}</p>
                  <p><strong>Quantity:</strong> {returns?.orderProductId?.quantity}</p>
                  <p><strong>Price:</strong> ₹{returns?.orderProductId?.price}</p>
                </div>
                <div className="col-md-6">
                  <div className="d-flex flex-wrap gap-2">
                    {returns?.orderProductId?.productId?.images?.slice(0, 3).map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:4000/${img}`}
                        alt="Product"
                        width={90}
                        height={90}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER INFO */}
            <div style={cardStyle}>
              {sectionTitle(FaReceipt, "Order Information")}
              <p><strong>Order ID:</strong> {returns?.orderId?.orderId}</p>
              <p><strong>Payment Method:</strong> {returns?.orderId?.paymentMethod}</p>
              <p><strong>Order Amount:</strong> ₹{returns?.orderId?.totalAmount}</p>
              <p><strong>Shipping Address:</strong> {returns?.orderId?.shippingDetails}</p>
              <p><strong>Order Date:</strong> {new Date(returns?.orderId?.orderDate).toLocaleString()}</p>
            </div>

            {/* RETURN INFO */}
            <div style={cardStyle}>
              {sectionTitle(FaUndo, "Return Details")}
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Reason</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formValues.reason}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formValues.description}
                    disabled
                  />
                </div>
              </div>
              <div className="mt-3">
                <p><strong>Request Date:</strong> {new Date(returns?.requestDate).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className="badge bg-info">{returns?.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnUpdate;
