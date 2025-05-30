import Pagetitle from "./pagetitle";
import { Link } from "react-router-dom";
import Userservices from "../../services/userservices";
import HelpTogal from "../Togal/HelpTogal";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import useAsync from "../../Hooks/useAsync";
import Modal from "react-modal";
import UserUpdate from "../update/UserUpdate";  // Updated Name
import DeleteButton from "../delete/deleteButton"; // Updated Name

Modal.setAppElement("#root");

function UserManager() {
  const { data, run } = useAsync(Userservices.getAllUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleEditDetails = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on the search term
  const filteredUsers = data?.users?.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.mobileNo?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const totalProducts = filteredUsers.length;
  const productsPerPage = 10;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredUsers.slice(startIndex, endIndex);
  return (
    <div className="right_col" role="main">
      <Pagetitle />
      <div className="container-box px-0">
        <div className="container-box-top-header px-4">
          <div className="container-box-top-header-left-2">
            <input
              type="search"
              name="search"
              placeholder="Search by User Name and mobileNo"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

        </div>

        <div className="container-box-inner" style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr className="trs">
                <th>#</th>

                <th>Name</th>
                <th>Email</th>
                <th>Mobile No</th>
                <th  >Address</th>
                <th>Status</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts?.map((user, i) => (
                <tr key={user._id}>
                  <td>{startIndex + i + 1}</td>

                  <td>{user.firstName} {user.lastName}</td>

                  <td>{user.email}</td>
                  <td>{user.mobileNo}</td>
                  <td style={{ width: '250px' }}>{user.address},{user.city},{user.state},{user.pincode}</td>
                  <td className="status-toggle">
                    <HelpTogal help={user} page="user" onSuccess={run} />
                  </td>
                  <td>
                    <button
                      className="view-details-btn"
                      onClick={() => handleEditDetails(user)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="viewdelete "
                      onClick={() => handleDelete(user)}
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

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="User Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <UserUpdate user={selectedUser} closeModal={closeEditModal} onSuccess={run} />
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <DeleteButton data={selectedUser} page="user" closeModal={closeDeleteModal} onSuccess={run} />
      </Modal>
    </div>
  );
}

export default UserManager;
