import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import orderServices from "../../services/orderServices";

const statusSteps = ["Pending", "Dispatch", "Shipped", "Delivered", "Cancel", "Return"];

const TrackOrder = () => {
  const { orderId, orderProductId } = useParams(); // productId = orderProductId
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!userId || !orderId) {
          console.warn("Missing userId or orderId.");
          setLoading(false);
          return;
        }
        console.log("orderId:", orderId);
        console.log("orderProductId:", orderProductId);
        const response = await orderServices.trackOrder(userId, orderId, orderProductId);
        const orders = response?.data;

        let orderProduct = null;
        if (Array.isArray(orders)) {
          orderProduct = orders.find((item) => item._id === orderProductId);
        } else if (orders && orders._id === orderProductId) {
          orderProduct = orders;
        }

        setOrder(orderProduct || null);
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [userId, orderId, orderProductId]);

  const getStepClass = (step) => {
    if (!order) return "step0";
    const currentIndex = statusSteps.indexOf(order.orderStatus);
    const stepIndex = statusSteps.indexOf(step);
    return stepIndex <= currentIndex ? "step0 active" : "step0";
  };

  return (
    <>
      <HomeHeader />

      <div className="sticky-header-next-sec ec-breadcrumb section-space-mb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row ec_breadcrumb_inner">
                <div className="col-md-6 col-sm-12">
                  <h2 className="ec-breadcrumb-title">Track Order</h2>
                </div>
                <div className="col-md-6 col-sm-12">
                  <ul className="ec-breadcrumb-list">
                    <li className="ec-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="ec-breadcrumb-item active">Track</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="ec-page-content section-space-p">
        <div className="container">
          {loading ? (
            <p className="text-center">Loading order details...</p>
          ) : order ? (
            <div className="ec-trackorder-content col-md-12">
              <div className="ec-trackorder-inner">
                <div className="ec-trackorder-top">
                  <h2 className="ec-order-id">Order ID: {order.orderId}</h2>
                  <div className="ec-order-detail">
                    <div>
                      Expected Arrival:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div>Order Status: {order.orderStatus}</div>

                    <div>Product Name: {order?.productId?.name}</div>
                    <div>Size: {order?.size}</div>
                    <div>Price: ₹{order?.price}</div>
                  </div>
                </div>

                <div className="ec-trackorder-bottom">
                  <div className="ec-progress-track">
                    <ul id="ec-progressbar">
                      {statusSteps.map((step) => (
                        <li key={step} className={getStepClass(step)}>
                          <span className="ec-track-icon">
                            <img
                              src={`/assets/images/icons/track_1.png`}
                              alt={step}
                            />
                          </span>
                          <span className="ec-progressbar-track" />
                          <span className="ec-track-title">
                            Order
                            <br />
                            {step}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-danger">
              No order found for this account.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TrackOrder;
