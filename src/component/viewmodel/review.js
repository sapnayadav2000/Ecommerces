import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import Pagetitle from "./pagetitle";
import Reviewservices from "../../services/reviewServices";
import useAsync from "../../Hooks/useAsync";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import HelpTogal from "../Togal/HelpTogal";
import ReviewButton from "../delete/deleteButton";
import ReviewUpdate from "../update/reviewUpdate";
import Modal from "react-modal";
Modal.setAppElement("#root");
function Reviews() {

  const { data, run } = useAsync(Reviewservices.getReviews); // Use the review services to fetch data
  console.log('fetch data', data)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // State for filtering by status
  const [ratingFilter, setRatingFilter] = useState(""); // State for filtering by rating
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const handleEditDetails = (review) => {
    setSelectedEdit(review);
    setIsEditModalOpen(true);
  };

  const handleDelete = (review) => {
    setSelectedEdit(review);
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

  // Handle Status Filter
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value); // Set the selected status from the dropdown
  };

  // Handle Rating Filter
  const handleRatingChange = (event) => {
    setRatingFilter(event.target.value); // Set the selected rating from the dropdown
  };

  // Filter data based on the search term, status, and rating
  const filteredReviews = data?.data?.filter((review) => {
    const matchesSearch = review?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? review.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesRating = ratingFilter ? review.rating === parseInt(ratingFilter) : true; // Check for rating filter
    return matchesSearch && matchesStatus && matchesRating;
  }) || [];
  const totalProducts = filteredReviews.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredReviews.slice(startIndex, endIndex);
  return (
    <div className="right_col" role="main">
      <Pagetitle />
      <div className="container-box px-0">
        <div className="container-box-top-header px-4">
          <div className="container-box-top-header-left-2">
            <input
              type="search"
              name="search"
              placeholder="Search by User Name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="d-flex">
            <div className="status-filter me-3"  >
              <select onChange={handleStatusChange} value={statusFilter} className="form-select border">
                <option value="">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Rating Filter Dropdown */}
            <div className="rating-filter"  >
              <select onChange={handleRatingChange} value={ratingFilter} className="form-select border">
                <option value="">Rating</option>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="container-box-inner">
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr className="trs">
                <th>#</th>
                <th>Images</th>
                <th>User Name</th>
                <th>Rating</th>
                <th>Description</th>
                <th>Status</th> {/* New Status column */}
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts?.map((review, i) => (
                <tr key={review._id}>
                  <td>{startIndex + i + 1}</td>

                  {/* Display Review Images */}
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {review.images?.length > 0 ? (
                        review.images.map((img, index) => (
                          <img
                            key={index}
                            src={`${process.env.REACT_APP_API_BASE_URL}/${img}`} // Ensure the path is correctly handled by your backend
                            alt={`review-${index}`}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "5px"
                            }}
                          />
                        ))
                      ) : (
                        <span>No Images</span>
                      )}
                    </div>
                  </td>

                  {/* Display Username */}
                  <td>{review.username}</td>

                  {/* Display Rating as Stars */}
                  <td>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={`fa-lg ${review.rating >= star ? 'text-warning' : 'text-muted'}`}
                      />
                    ))}
                  </td>

                  {/* Display Comment */}
                  <td>{review.description}</td>

                  {/* Display Status */}
                  <td className="status-toggle">
                    <HelpTogal
                      help={review}
                      page="review"
                      onSuccess={() => run()}
                    />
                  </td>
                  <td>
                    <button
                      className="view-details-btn  "
                      onClick={() => handleEditDetails(review)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="viewdelete"
                      onClick={() => handleDelete(review)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {/* Edit Review Modal (optional) */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="User Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <ReviewUpdate
          review={selectedEdit}
          closeModal={closeEditModal}
          onSuccess={run}
        />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <ReviewButton
          data={selectedEdit}
          page="review"
          closeModal={closeDeleteModal}
          onSuccess={run}
        />
      </Modal>
    </div>
  );
}

export default Reviews;
