// import AdminServices from "../services/Adminservices"
import Pagetitle from "./pagetitle";
import { Link } from "react-router-dom";
import CategoryServices from "../../services/categoryServices";
import HelpTogal from "../Togal/HelpTogal";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import useAsync from "../../Hooks/useAsync";
import Modal from "react-modal";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CategoryUpdate from "../update/categoryUpdate";
import CategoryButton from "../delete/deleteButton";

Modal.setAppElement("#root");
function Category() {
  const { data, run } = useAsync(CategoryServices.getCategory);
  const count = data?.data?.length;
  const [activeIndex, setActiveIndex] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const handleEditDetails = (cat) => {
    setSelectedEdit(cat);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cat) => {
    setSelectedEdit(cat);
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

  const toggleActionMenu = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Toggle the active index
  };
  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Filter data based on the search term
  const filteredData = data?.data?.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )||[];

  
  const totalProducts = filteredData.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredData.slice(startIndex, endIndex);
  return (
    <div className="right_col" role="main">
      <Pagetitle></Pagetitle>
      <div className="container-box px-0">
        <div className="container-box-top-header px-4">
          <div className="container-box-top-header-left-2">
            <input
              type="search"
              name="search"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div className="sub-title-box-right">
            <Link
              className="Add-new-btn site-btn-green "
              to="/add-category"
            >
              <img src="img/add-plus.svg" alt="" />
              <span className="ms-2">Add New</span>
            </Link>
          </div>
        </div>

        <div className="container-box-inner">
          <table id="example" className="table" style={{ width: "100%" }}>
            <thead>
              <tr class="trs">
                <th scope="col">#</th>
                <th scope="col">IMAGE</th>
                <th scope="col">Name</th>
                <th scope="col">STATUS</th>
                <th scope="col">EDIT</th>
                <th scope="col">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts?.map((cat, i) => (
                <tr key={i}>
                  <td>{startIndex + i + 1}</td>

                  <td>
                    <div className="product-img">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${cat?.image}`}
                        alt="image"
                        style={{
                          height: "70px",
                          width: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </td>
                  <td>{cat.name}</td>

                  <td className="status-toggle">
                    <HelpTogal help={cat} page="cat" onSuccess={() => run()} />
                  </td>
                  <td>
                    <button
                      className="view-details-btn  bg-primary"
                      onClick={() => handleEditDetails(cat)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </td>
                  <td>
                    <button
                      className="viewdelete bg-danger"
                      onClick={() => handleDelete(cat)}
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
    className={`btn rounded-pill px-3 mx-1 ${
      currentPage === index + 1 ? "text-black fw-bold" : "btn-light border"
    }`}
    style={
      currentPage === index + 1
        ? { backgroundColor: "#96ba6e", border: "1px solid #96ba6e" } // light green
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
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="User Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <CategoryUpdate
          cat={selectedEdit}
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
        <CategoryButton
          data={selectedEdit}
          page="cat"
          closeModal={closeDeleteModal}
          onSuccess={run}
        />
      </Modal>
    </div>
  );
}

export default Category;
