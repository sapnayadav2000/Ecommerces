import React, { useState, useEffect } from "react";
import OrderServices from "../../services/orderServices";
import Pagetitle from "./pagetitle";
import useAsync from "../../Hooks/useAsync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useCurrency } from "../../forntend/CurrencyContent";
function Order() {
  const { data } = useAsync(OrderServices.getAllOrders);
  const { currency } = useCurrency();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

const filteredOrders =
  orders?.filter((order) =>
    `${order?.userId?.name} ${order?.orderId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const totalProducts = filteredOrders.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredOrders.slice(startIndex, endIndex);

  const handleOrderStatusChange = (orderId, orderProductId, newStatus) => {
    OrderServices.updateOrderStatus(orderId, orderProductId, { orderStatus: newStatus })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order._id === orderId) {
              const updatedOrderProducts = order.orderProducts.map((product) => {
                if (product._id === orderProductId) {
                  return { ...product, orderStatus: newStatus };
                }
                return product;
              });
              return { ...order, orderProducts: updatedOrderProducts };
            }
            return order;
          })
        );
      })
      .catch((err) => {
        console.error("Status update failed", err);
      });
  };

  const getCombinedStatus = (orderProducts) => {
    if (!orderProducts || orderProducts.length === 0) return "No Status";
    const statuses = orderProducts.map((p) => p.orderStatus);
    const uniqueStatuses = [...new Set(statuses)];
    return uniqueStatuses.join(", ");
  };

  return (
    <div className="right_col" role="main">
      <Pagetitle />

      <div className="container-box px-0">
        {/* Keep your search input and button exactly as is */}
        <div className="container-box-top-header px-4" style={{ marginBottom: "20px" }}>
          <div className="container-box-top-header-left-2" style={{ display: "flex", alignItems: "center" }}>
            <input
              type="search"
              name="search"
              placeholder="Search by User or OrderId"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "8px 12px",
                borderRadius: "6px 0 0 6px",
                
                outline: "none",
                width: "280px",
                fontSize: "15px",
              }}
            />
            <button
              className="search-btn"
              style={{
                padding: "9px 14px",
                borderRadius: "0 6px 6px 0",
                border: "1.5px solid #699836",
                backgroundColor: "#699836",
                color: "white",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {/* Unique order cards layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {currentProducts.map((order) => (
            <div
              key={order._id}
              style={{
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <div>
                  <strong>Order ID:</strong> {order.orderId}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ flexBasis: "20%" }}>
                  <h4>User</h4>
                  <p>{order.userId?.name || "N/A"}</p>
                  <h5>Shipping Details</h5>
                  <p>{order.shippingDetails || "N/A"}</p>
                </div>

                <div style={{ flexBasis: "50%" }}>
                  <h4>Products</h4>
                  {order.orderProducts?.map((product) => (
                    <div
                      key={product._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "12px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <img
                        src={
                          Array.isArray(product.productId?.images) &&
                          product.productId.images.length > 0
                            ? `http://localhost:4000/${product.productId.images[0]}`
                            : "/placeholder.jpg"
                        }
                        alt={product.productId?.name || "No Image"}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginRight: "15px",
                        }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: "600", fontSize: "16px" }}>
                          {product.productId?.name || "N/A"}
                        </div>
                        <div style={{ fontSize: "14px", color: "#555" }}>
                          Qty: {product.quantity} | Size: {product.size}
                        </div>
                      </div>
                      <select
                      className="form-select"
                        value={product.orderStatus}
                        onChange={(e) =>
                          handleOrderStatusChange(order._id, product._id, e.target.value)
                        }
                        style={{
                          backgroundColor: (() => {
                            switch (product.orderStatus) {
                                case "Pending":
                                  return "#f0ad4e"; // Soft orange
                                case "Dispatch":
                                  return "#5bc0de"; // Light blue
                                case "Shipped":
                                  return "#0275d8"; // Darker blue
                                case "Delivered":
                                  return "#5cb85c"; // Green
                                case "Cancel":
                                  return "#d9534f"; // Bootstrap red
                                case "Return":
                                  return "#c9302c"; // Dark red
                                default:
                                  return "#6c757d";
                            }
                          })(),
                          color: "#fff",
                          borderRadius: "5px",
                          padding: "6px 10px",
                          border: "none",
                          cursor: "pointer",
                          minWidth: "60px",
                        }}
                      >
                        <option value="Pending" style={{ backgroundColor: "#f0ad4e" }}>
                          Pending
                        </option>
                        <option value="Dispatch" style={{ backgroundColor: "#5bc0de" }}>
                          Dispatch
                        </option>
                        <option value="Shipped" style={{ backgroundColor: "#0275d8" }}>
                          Shipped
                        </option>
                        <option value="Delivered" style={{ backgroundColor: "#5cb85c" }}>
                          Delivered
                        </option>
                        <option value="Cancel" style={{ backgroundColor: "#d9534f" }}>
                          Cancelled
                        </option>
                        <option value="Return" style={{ backgroundColor: "#c9302c" }}>
                          Return
                        </option>
                      </select>
                    </div>
                  )) || "No products"}
                </div>

                <div style={{ flexBasis: "20%" }}>
                  <h4>Summary</h4>
                  <p>
                    <strong>Total:</strong>  {currency.symbol}{order.totalAmount}
                  </p>
                  <p>
                    <strong>Status:</strong> {getCombinedStatus(order.orderProducts)}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentStatus}
                  </p>
                  <p>
                    <strong>Method:</strong> {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          className="pagination-controls d-flex justify-content-center my-4"
          style={{ gap: "8px", display: "flex", flexWrap: "wrap" }}
        >
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;

