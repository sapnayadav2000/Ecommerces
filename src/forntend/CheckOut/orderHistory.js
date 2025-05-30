import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import OrderServices from "../../services/orderServices";
import { toast } from "react-toastify";
import UserInvoice from "../userInformation/UserInvoice";
import { useCurrency } from "../CurrencyContent";

const OrderHistory = () => {
  const { currency } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user._id) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await OrderServices.getOrders(user?._id);
        console.log("response data", response);
        setOrders(response || []);
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user]);

  const CancelOrder = async (orderId, productId) => {
    try {
      await OrderServices.cancelProductInOrder(orderId, productId);
      toast.success("Product canceled from order");

      const response = await OrderServices.getOrders(user?._id);
      setOrders(response || []);
    } catch (err) {
      console.error("Error canceling product from order:", err);
      toast.error("Failed to cancel the product. Please try again.");
    }
  };

  const handleReviewClick = (productId) => {
    navigate(`/review/${productId}`);
  };
  const handleReturnClick = (orderProductId) => {
    navigate(`/return-request/${orderProductId}`);
  };

  const handleReturnClicks = (orderProductId) => {
    navigate(`/ticket/${orderProductId}`);
  };

  if (loading) return <div className="text-center mt-5">Loading orders...</div>;
  if (!orders.length)
    return <div className="text-center mt-5">You have no orders yet.</div>;

  return (
    <>
      <HomeHeader />
      <div className="container py-5">
  <h2 className="text-center mb-5 display-5 fw-bold text-primary">
    Your Order History
  </h2>

  {Array.isArray(orders) && orders.length > 0 ? (
    orders.map((order) => (
      <div
        key={order._id}
        className="order-card position-relative p-4 mb-5 bg-white rounded-4 shadow-lg border-start border-5 border-primary"
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <small className="text-muted">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </small>
          <span
            className={`badge px-3 py-2 rounded-pill fs-6 fw-semibold ${
              order.orderStatus === "Cancel"
                ? "bg-danger"
                : order.orderStatus === "Delivered"
                ? "bg-success"
                : "bg-warning text-dark"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Products */}
        {order.orderProducts.map((item, idx) => (
          <div
            key={idx}
            className="d-flex flex-column flex-md-row gap-3 align-items-start mb-4 p-3 rounded-3 bg-light-subtle shadow-sm"
            style={{ transition: "0.3s", border: "1px solid #e0e0e0" }}
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/${item.productId?.images?.[0]}`}
              alt={item.productId?.name}
              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
              className="rounded-3"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
                border: "1px solid #ccc",
              }}
            />

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <h6 className="fw-bold mb-1">{item.productId?.name}</h6>
                <span
                  className={`badge px-3 py-2 rounded-pill fs-6 fw-medium ${
                    item.orderStatus === "Cancel"
                      ? "bg-danger"
                      : item.orderStatus === "Delivered"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {item.orderStatus}
                </span>
              </div>
              <p className="text-muted mb-1">
                Size: {item.size} | Qty: {item.quantity}
              </p>
              <p className="fw-bold text-success mb-2">
                {currency.symbol}
                {item.price.toFixed(2)}
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 mt-2">
                <Link to={`/track-order/${item.orderId}/${item._id}`}>
                  <button className="btn btn-outline-primary btn-sm">
                    Track Order
                  </button>
                </Link>

                {item.orderStatus === "Delivered" && (
                  <>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleReviewClick(item.productId?._id)}
                    >
                      Leave a Review
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleReturnClick(item._id)}
                    >
                      Return Policy
                    </button>
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => handleReturnClicks(item._id)}
                    >
                      Create Ticket
                    </button>
                  </>
                )}

                {item.orderStatus !== "Cancel" &&
                  item.orderStatus !== "Delivered" &&
                  item.orderStatus !== "Return" && (
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() =>
                        CancelOrder(order._id, item.productId._id)
                      }
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}

        {/* Order Summary */}
        <div className="pt-3 mt-3 border-top">
          <p className="mb-1">
            <strong>Name:</strong> {order?.userAddress?.firstName}{" "}
            {order?.userAddress?.lastName}
          </p>
          <p className="mb-1">
            <strong>Phone:</strong> {order?.userAddress?.phone}
          </p>
          <p className="mb-1">
            <strong>Shipping:</strong> {order?.userAddress?.address},{" "}
            {order?.userAddress?.city}, {order?.userAddress?.state} -{" "}
            {order?.userAddress?.pincode}
          </p>
          <p className="mb-1">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p className="mb-1">
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p className="mb-1 fw-bold">
            <strong>Total:</strong> {currency.symbol}
            {order.totalAmount.toFixed(2)}
          </p>
        </div>

        {/* Invoice Component */}
        <UserInvoice order={order} />
      </div>
    ))
  ) : (
    <div className="text-center text-muted fs-5">You have no orders yet.</div>
  )}
</div>

     

      <Footer />
    </>
  );
};

export default OrderHistory;


//  <div className="container py-5">
//         <h2 className="text-center mb-5 display-5 fw-bold text-primary">
//           Your Order History
//         </h2>

//         {Array.isArray(orders) && orders.length > 0 ? (
//           orders.map((order) => (
//             <div
//               key={order._id}
//               className="order-card border-start border-4 border-primary shadow-sm p-4 mb-5 bg-white rounded-4"
//               style={{ transition: "0.5s", background: "#fff" }}
//             >
//               <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
//                 <div>
//                   <small className="text-muted fs-6">
//                     Placed on: {new Date(order.createdAt).toLocaleString()}
//                   </small>
//                 </div>
//                 <span
//                   className={`badge px-3 py-2 rounded-pill fs-6 fw-medium  ${
//                     order.orderStatus === "Cancel"
//                       ? "bg-danger"
//                       : order.orderStatus === "Delivered"
//                       ? "bg-success"
//                       : "bg-warning text-dark"
//                   }`}
//                 >
//                   {order.orderStatus}
//                 </span>
//               </div>

//               {/* Order Products */}
//              {order.orderProducts.map((item, idx) => (
//   <div
//     key={idx}
//     className="d-flex flex-column flex-md-row align-items-start gap-3 p-3 rounded shadow-sm mb-4"
//     style={{ background: "#f8f9fa", borderRadius: "10px" }}
//   >
//     {/* Product Image */}
//     <img
//       src={`${process.env.REACT_APP_API_BASE_URL}/${item.productId?.images?.[0]}`}
//       alt={item.productId?.name}
//       onError={(e) => (e.target.src = "/placeholder-image.jpg")}
//       style={{
//         width: "90px",
//         height: "90px",
//         objectFit: "cover",
//         borderRadius: "8px",
//         border: "1px solid #ddd",
//       }}
//     />

//     {/* Product Info + Badge Right */}
//     <div className="flex-grow-1 w-100">
//       <div className="d-flex justify-content-between align-items-start">
//         <h6 className="fw-semibold mb-2">{item.productId?.name}</h6>

//         <span
//           className={`badge px-3 py-2 rounded-pill fs-6 fw-medium ${
//             item.orderStatus === "Cancel"
//               ? "bg-danger"
//               : item.orderStatus === "Delivered"
//               ? "bg-success"
//               : "bg-warning text-dark"
//           }`}
//         >
//           {item.orderStatus}
//         </span>
//       </div>

//       <div className="text-muted mb-1">
//         Size: {item.size} | Qty: {item.quantity}
//       </div>
//       <div className="fw-bold text-success">
//         {currency.symbol}
//         {item.price.toFixed(2)}
//       </div>


//       <div className="d-flex flex-wrap gap-2 mt-4">
        
// <Link to={`/track-order/${item.orderId}/${item._id}`}>
//   <button className="btn btn-primary btn-sm mb-3">Track Order</button>
// </Link>
//         {item.orderStatus === "Delivered" && (
//           <>
//             <button
//               className="btn btn-primary btn-sm"
//               onClick={() => handleReviewClick(item.productId?._id)}
//             >
//               Leave a Review
//             </button>
//             <button
//               className="btn btn-primary btn-sm"
//               onClick={() => handleReturnClick(item._id)}
//             >
//               Return Policy
//             </button>
//             <button
//               className="btn btn-primary btn-sm"
//               onClick={() => handleReturnClicks(item._id)}
//             >
//               Create Ticket
//             </button>
//           </>
//         )}

//      {item.orderStatus !== "Cancel" &&
//  item.orderStatus !== "Delivered" &&
//  item.orderStatus !== "Return" && (
//   <button
//     className="btn btn-primary btn-sm"
//     onClick={() => CancelOrder(order._id, item.productId._id)}
//   >
//     Cancel Order
//   </button>
// )}
//       </div>
//     </div>
//   </div>
// ))}


//               {/* Address and Summary */}
//               <div className="mt-4">
//                 <p className="mb-1">
//                   <strong>Name:</strong> {order?.userAddress?.firstName}{" "}
//                   {order?.userAddress?.lastName}
//                 </p>
//                 <p className="mb-1">
//                   <strong>Phone:</strong> {order?.userAddress?.phone}
//                 </p>
//                 <p className="mb-1">
//                   <strong>Shipping:</strong> {order?.userAddress?.address},{" "}
//                   {order?.userAddress?.city}, {order?.userAddress?.state} -{" "}
//                   {order?.userAddress?.pincode}
//                 </p>
//                 <p className="mb-1">
//                   <strong>Payment Method:</strong> {order.paymentMethod}
//                 </p>
//                 <p className="mb-1">
//                   <strong>Payment Status:</strong> {order.paymentStatus}
//                 </p>
//                 <p className="mb-1">
//                   <strong>Total:</strong> {currency.symbol}
//                   {order.totalAmount.toFixed(2)}
//                 </p>
//               </div>

//               {/* Invoice */}
//               <UserInvoice order={order} />
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-muted fs-5">
//             You have no orders yet.
//           </div>
//         )}
//       </div>