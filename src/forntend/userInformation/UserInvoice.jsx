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
        <button
          className="btn shadow-lg rounded-pill px-4"
          onClick={() => setShowModal(true)}
        >
          <i className="fa fa-download me-2 " />
          View Invoice
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
            <div className="modal-content shadow-lg rounded-4" style={{ background: "#fff" }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h4 className="modal-title fw-bold text-primary">Invoice Preview</h4>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body" ref={invoiceRef}>
                <div className="p-4">
                  <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
                    <div>
                      <h5 className="fw-bold">Order Invoice</h5>
                      <p className="mb-1"><strong>Order ID:</strong> {orderId}</p>
                      <p className="mb-1"><strong>Order Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
                      <p className="mb-1"><strong>GST NO:</strong> 06AAJCC8517E1ZP</p>
                    </div>

                    <div>
                      <h6 className="fw-bold">Billing Address</h6>
                      <p className="mb-1">{order?.userAddress?.firstName} {order?.userAddress?.lastName}</p>
                      <p className="mb-1">{order?.userAddress?.phone}</p>
                      <p className="mb-1">
                        {order?.userAddress?.address}, {order?.userAddress?.city}, {order?.userAddress?.state} - {order?.userAddress?.pincode}
                      </p>
                    </div>

                    <div>
                      <h6 className="fw-bold">Shipping Address</h6>
                      <p className="mb-1">{order?.userAddress?.firstName} {order?.userAddress?.lastName}</p>
                      <p className="mb-1">{order?.userAddress?.phone}</p>
                      <p className="mb-1">
                        {order?.userAddress?.address}, {order?.userAddress?.city}, {order?.userAddress?.state} - {order?.userAddress?.pincode}
                      </p>
                      <p className="mb-1"><strong>Payment Method:</strong> {paymentMethod}</p>
                      <p className="mb-0"><strong>Payment Status:</strong> {paymentStatus}</p>
                    </div>
                  </div>

                  {Array.isArray(orderProducts) && orderProducts.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped align-middle text-center">
                        <thead className="table-light">
                          <tr>
                            <th>Sr.No.</th>
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
                              <td>{idx + 1}</td>
                              <td>{item.productId?.name}</td>
                              <td>{item.size}</td>
                              <td>{currency.symbol}{item.price}</td>
                              <td>{item.quantity}</td>
                              <td>{currency.symbol}{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted">No products found in this order.</p>
                  )}

                  <div className="d-flex justify-content-end mt-4">
                    <div className="text-end">
                      <h5 className="fw-bold text-dark">
                        Grand Total: {currency.symbol}{totalAmount.toFixed(2)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 pt-0">
                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button className="btn btn-success rounded-pill px-4" onClick={downloadInvoice}>
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
