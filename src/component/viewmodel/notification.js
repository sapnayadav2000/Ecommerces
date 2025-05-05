import Pagetitle from "./pagetitle";
import HelpTogal from "../Togal/HelpTogal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import useAsync from "../../Hooks/useAsync";
import Notificationservices from "../../services/notificationServices.js";
import { useState } from "react";
import Modal from "react-modal";
import NotificationUpdate from "../update/notificationUpdate";
import DeleteButton from "../delete/deleteButton.js";
Modal.setAppElement("#root");
function Notification() {
  const { data, run } = useAsync(Notificationservices.getNotification);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const filteredData = data?.data?.filter((slider) =>
    slider.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEdit(null);
  };
  const handleDelete = (slider) => {
    setSelectedEdit(slider);
    setIsDeleteModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEdit(null);
  };

  const handleEditDetails = (slider) => {
    setSelectedEdit(slider);
    setIsEditModalOpen(true);
  };
  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box px-0">
          <div className="container-box-top-header px-4">
            <div className="container-box-top-header-left-2">
              <input
                type="search"
                name="search"
                placeholder="Search by  Title"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className="sub-title-box-right">
              <Link
                className="Add-new-btn site-btn-green me-5"
                to="/add-notification"
              >
                <img src="img/add-plus.svg" alt="" />
                <span className="ms-2">Add New</span>
              </Link>
            </div>
          </div>

          <div className="container-box-inner">
            <table id="example" className="table " style={{ width: "100%" }}>
              <thead>
                <tr class="trs">
                  <th scope="col">#</th>
                  <th scope="col">IMAGE</th>
                  <th scope="col">TITLE</th>
                  <th scope="col">MESSAGE</th>
                  <th scope="col">STATUS</th>
                  <th scope="col">EDIT</th>
                  <th scope="col">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((slider, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="product-img">
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}/${slider?.image}`}
                          alt="image"
                          style={{
                            height: "70px",
                            width: "70px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </td>
                    <td>{slider.title}</td>
                    <td>{slider.message}</td>
                    <td className="status-toggle">
                      <HelpTogal
                        help={slider}
                        page="Notification"
                        onSuccess={() => run()}
                      />
                    </td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => handleEditDetails(slider)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                    <td>
                      <button
                        className="viewdelete"
                        onClick={() => handleDelete(slider)}
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
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="User Details"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <NotificationUpdate
            notification={selectedEdit}
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
          <DeleteButton
            data={selectedEdit}
            page="notification"
            closeModal={closeDeleteModal}
            onSuccess={run}
          />
        </Modal>
      </div>
    </>
  );
}

export default Notification;
