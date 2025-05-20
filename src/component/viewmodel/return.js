import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Pagetitle from "./pagetitle";
import Returnservices from "../../services/returnServices";
import useAsync from "../../Hooks/useAsync";
import HelpTogal from "../Togal/HelpTogal";
import ReturnButton from "../delete/deleteButton";
import ReturnUpdate from "../update/returnUpdate";
import Modal from "react-modal";
import { useCurrency } from "../../forntend/CurrencyContent";
Modal.setAppElement("#root");

function Return() {
    const { currency } = useCurrency();
  const { data, run } = useAsync(Returnservices.getAllReturn);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const handleEditDetails = (returns) => {
    setSelectedEdit(returns);
    setIsEditModalOpen(true);
  };

  const handleDelete = (returns) => {
    setSelectedEdit(returns);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEdit(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEdit(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const filteredreturns = data?.returns?.filter((returns) => {
    const matchesSearch = returns?.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? returns.status.toLowerCase() === statusFilter.toLowerCase() : true;
    return matchesSearch && matchesStatus;
  }) || [];

  const totalProducts = filteredreturns.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredreturns.slice(startIndex, endIndex);

  return (
    <div className="right_col" role="main">
      <Pagetitle />
      <div className="container-box px-0">
        <div className="container-box-top-header px-4">
          <div className="container-box-top-header-left-2">
            <input
              type="search"
              name="search"
              placeholder="Search by Reason"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="container-box-top-header-right-2">
            <select onChange={handleStatusChange} value={statusFilter}>
              <option value="">Filter by Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="container-box-inner">
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr className="trs">
                <th>#</th>
                <th>Order ID</th>
                <th>User Name</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
                <th>Product Details</th>
                <th>Reason</th>
                <th>Description</th>
               
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
  {currentProducts?.map((returns, i) => (
    <tr key={returns._id}>
    
       <td>{startIndex + i + 1}</td>
      <td>{returns.orderId?.orderId || "N/A"}</td>
       <td>{returns.userId?.name || "N/A"}</td>
      <td> {currency.symbol}{returns.orderId.totalAmount || "N/A"}</td>
       <td>{returns.orderId.paymentMethod || "N/A"}</td>

       <td>
  <div className="product-item">
    {Array.isArray(returns.orderProductId?.productId?.images) && returns.orderProductId.productId.images.length > 0 ? (
      returns.orderProductId.productId.images.map((img, index) => (
        <img
          key={index}
          src={`http://localhost:4000/${img}`}
          alt={`Product ${index + 1}`}
          style={{
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "5px",
            marginRight: "5px",
            marginTop: "4px"
          }}
        />
      ))
    ) : (
      <img
        src="/placeholder.jpg"
        alt="No Image Available"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "5px",
          marginRight: "5px",
          marginTop: "4px"
        }}
      />
    )}
   <br></br> {returns.orderProductId?.productId?.name || "N/A"} (Quantity{returns.orderProductId.quantity}) (Size {returns.orderProductId.size})
  </div>
</td>

      <td>{returns.reason || "N/A"}</td> {/* Fix: Ensure this is a string */}
      <td>{returns.description || "N/A"}</td> {/* Fix: Ensure this is a string */}
      <td className="status-toggle">
        <HelpTogal
          help={returns}
          page="returns"
          onSuccess={() => run()}
        />
      </td>
      <td>
        <button
          className="view-details-btn  bg-primary"
          onClick={() => handleEditDetails(returns)}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </td>
      <td>
        <button
          className="viewdelete bg-danger"
          onClick={() => handleDelete(returns)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls d-flex justify-content-center my-3">
          <button
            className="btn btn-sm btn-secondary mx-1"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm mx-1 ${currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn btn-sm btn-secondary mx-1"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Return"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <ReturnUpdate
          returns={selectedEdit}
          closeModal={closeEditModal}
          onSuccess={run}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Return"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <ReturnButton
          data={selectedEdit}
          page="returns"
          closeModal={closeDeleteModal}
          onSuccess={run}
        />
      </Modal>
    </div>
  );
}

export default Return;
