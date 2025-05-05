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
Modal.setAppElement("#root");

function Return() {
  const { data, run } = useAsync(Returnservices.getAllReturn); // Fetch return requests
  console.log('response',data)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);

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
    setStatusFilter(event.target.value); // Update status filter
  };

  // Filter return requests based on search term and status
  const filteredreturns = data?.data?.filter((returns) => {
    const matchesSearch = returns?.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? returns.status.toLowerCase() === statusFilter.toLowerCase() : true;
    return matchesSearch && matchesStatus;
  });

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
                <th>Reason</th>
                <th>Description</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredreturns?.map((returns, i) => (
                <tr key={returns._id}>
                  <td>{i + 1}</td>
                  <td>{returns.reason}</td>
                  <td>{returns.description || "N/A"}</td>
                  <td className="status-toggle">
                    <HelpTogal
                      help={returns}
                      page="returns"
                      onSuccess={() => run()}
                    />
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => handleEditDetails(returns)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="viewdelete"
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
      </div>

      {/* Edit returns Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Return Request Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <ReturnUpdate
          returns={selectedEdit}
          closeModal={closeEditModal}
          onSuccess={run}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
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
