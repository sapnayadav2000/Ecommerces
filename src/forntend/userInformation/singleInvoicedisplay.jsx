import React, { useEffect, useState } from "react";
import UserInvoice from "../userInformation/UserInvoice";
import OrderServices from "../../services/orderServices";

const SingleInvoiceDisplay = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchFirstOrder = async () => {
      try {
        const response = await OrderServices.getOrders(user?._id);
        if (Array.isArray(response) && response.length > 0) {
          setOrder(response[0]); // Just the first order
        } else if (response.orders && Array.isArray(response.orders)) {
          setOrder(response.orders[0]); // In case it's wrapped in `.orders`
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchFirstOrder();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <h4 className="text-center mt-5">Loading invoice...</h4>;
  if (!order) return <h4 className="text-center mt-5">No order found.</h4>;

  return <UserInvoice order={order} />;
};

export default SingleInvoiceDisplay;
