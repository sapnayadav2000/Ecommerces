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

  const filteredOrders = orders?.filter((order) =>
    `${order?.userId?.name} ${order?.orderId}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredOrders.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const statusOrder = [
    "Pending",
    "Dispatch",
    "Shipped",
    "Delivered",
    "Cancel",
    "Return",
  ];

  const isOptionDisabled = (current, next) => {
    const currentIndex = statusOrder.indexOf(current);
    const nextIndex = statusOrder.indexOf(next);
    return nextIndex < currentIndex;
  };

  const handleOrderStatusChange = (orderId, orderProductId, newStatus) => {
    OrderServices.updateOrderStatus(orderId, orderProductId, { orderStatus: newStatus })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order._id === orderId) {
              const updatedProducts = order.orderProducts.map((p) =>
                p._id === orderProductId ? { ...p, orderStatus: newStatus } : p
              );
              return { ...order, orderProducts: updatedProducts };
            }
            return order;
          })
        );
      })
      .catch((err) => console.error("Status update failed", err));
  };

  return (
    <div className="right_col" role="main">
      <Pagetitle />

      <div className="container-box px-4">
        {/* Search bar */}
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
                border: "1.5px solid #96ba6e",
                backgroundColor: "#96ba6e",
                color: "white",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>User</th>
                <th>Shipping Details</th>
                <th>Products</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, i) => (



                <tr key={`${order._id}-${i}`}>
                  <td>{startIndex + i + 1}</td>
                  <td>{order.orderId}</td>
                  <td>{order.userAddress ? `${order.userAddress.firstName} ${order.userAddress.lastName}` : "N/A"}</td>

                  <td>{order.shippingDetails || "N/A"}</td>
                  <td>
                    {order.orderProducts?.map((product) => (
                      <div
                        key={product._id}
                        className="d-flex align-items-center mb-2"

                      >
                        <img
                          src={
                            product.productId?.images?.[0]
                              ? `http://localhost:4000/${product.productId.images[0]}`
                              : "/placeholder.jpg"
                          }
                          alt={product.productId?.name}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            marginRight: "10px",
                            borderRadius: "4px",
                          }}
                        />
                        <div className="flex-grow-1">
                          <div>{product.productId?.name}</div>
                          <div className="small text-muted">
                            Qty: {product.quantity} | Size: {product.size}
                          </div>
                        </div>

                      </div>
                    ))}
                  </td>
                  <td><b>{currency.symbol}{order.totalAmount?.toFixed(2)}</b></td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    {order.orderProducts?.map((product, idx) => (
                      <div key={product._id || idx} style={{ marginBottom: "8px" }}>
                        <select
                          className="form-select form-select-sm"
                          value={product.orderStatus}
                          onChange={(e) =>
                            handleOrderStatusChange(order._id, product._id, e.target.value)
                          }
                          style={{
                            minWidth: "100px",
                            backgroundColor: (() => {
                              switch (product.orderStatus) {
                                case "Pending": return "rgb(243 205 152)";
                                case "Dispatch": return "rgb(166 220 236)";
                                case "Shipped": return "rgb(151 197 238)";
                                case "Delivered": return "rgb(150 223 150)";
                                case "Cancel": return "rgb(244 141 138)";
                                case "Return": return "rgb(244 141 138)";
                                default: return "#6c757d";
                              }
                            })(),
                            color: "#000",
                          }}
                        >
                          {["Cancel", "Return"].includes(product.orderStatus) ? (
                            <option value={product.orderStatus}>{product.orderStatus}</option>
                          ) : (
                            statusOrder
                              .filter((s) => !["Cancel", "Return"].includes(s))
                              .map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  disabled={isOptionDisabled(product.orderStatus, status)}
                                >
                                  {status}
                                </option>
                              ))
                          )}
                        </select>
                      </div>
                    ))}
                  </td>

                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-controls d-flex justify-content-center my-3">
          <button
            className="btn btn-light border rounded-pill px-3 mx-1 d-flex align-items-center"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn rounded-pill px-3 mx-1 ${currentPage === index + 1 ? "text-black fw-bold" : "btn-light border"
                }`}
              style={
                currentPage === index + 1
                  ? { backgroundColor: "#dcf6e6", border: "1px solid #dcf6e6" } // light green
                  : {}
              }
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-light border rounded-pill px-3 mx-1 d-flex align-items-center"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Order;

