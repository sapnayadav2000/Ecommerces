import React, { useState, useRef } from "react";
import { useCurrency } from "../CurrencyContent";
import html2pdf from "html2pdf.js";

const UserInvoice = ({ order }) => {
  const { currency } = useCurrency();
  const [showModal, setShowModal] = useState(false);
  const invoiceRef = useRef();

  if (!order) return <h1>Loading...</h1>;
  console.log("order product", order);
  const {
    orderId,
    address,
    createdAt,
    orderProducts,
    totalAmount,
    paymentMethod,
    paymentStatus,
  } = order;
  const customerName = address?.firstName || "N/A";

  const calculateSubtotal = () => {
    if (!Array.isArray(orderProducts)) return 0; // Ensure  orderProducts is an array
    return orderProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  const downloadInvoice = () => {
    if (!invoiceRef.current) return alert("Invoice content not found.");
    html2pdf()
      .set({
        margin: 1,
        filename: `invoice_${orderId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(invoiceRef.current)
      .save();
  };

  return (
    <div>
      {/* Button to trigger invoice modal */}
      <div className="text-center my-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fa fa-download me-2" />
          View  Invoice
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Invoice Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body" ref={invoiceRef}>
                <div className="card shadow p-4">
                  <div className="d-flex justify-content-between mb-4">
                    <div>
                      <h4 className="fw-bold">Order Invoice</h4>
                      <p>Order ID: {orderId}</p>
                      <p>Date: {new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-end">
                      <p className="mb-1">
                        <strong>Name:</strong>{" "}
                        {order?.userAddress?.firstName || "N/A"}{" "}
                        {order?.userAddress?.lastName || "N/A"}
                      </p>
                      <p className="mb-1 ml-1">
                        <strong>Shipping:</strong> {order?.userAddress?.address}
                        , {order?.userAddress?.city},{" "}
                        {order?.userAddress?.state} -{" "}
                        {order?.userAddress?.pincode}
                      </p>
                      <p>Payment Method: {paymentMethod}</p>
                      <p>Payment Status: {paymentStatus}</p>
                    </div>
                  </div>

                  {Array.isArray(orderProducts) && orderProducts.length > 0 ? (
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Size</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderProducts.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.productId?.name}</td>
                            <td>{item.size}</td>
                            <td>
                              {currency.symbol}
                              {item.price}
                            </td>
                            <td>{item.quantity}</td>
                            <td>
                              {currency.symbol}
                              {(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No orderProducts found in this order.</p> // Fallback message if  orderProducts is empty or undefined
                  )}

                  <div className="text-end">
                    <h5 className="fw-bold">
                      Grand Total: {currency.symbol}
                      {totalAmount.toFixed(2)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={downloadInvoice}>
                  <i className="fa fa-download me-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInvoice;
