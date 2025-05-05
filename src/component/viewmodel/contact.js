import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import Pagetitle from "./pagetitle";
import contactServices from "../../services/conatctServices";
import useAsync from "../../Hooks/useAsync";
// import CategoryUpdate from "../update/categoryUpdate";
import HelpTogal from "../Togal/HelpTogal";
import ContactButton from "../delete/deleteButton";
import Modal from "react-modal";
Modal.setAppElement("#root");
function Conatct() {
  const { data, run } = useAsync(contactServices.getConatct);
  console.log("data", data);

  const count = data?.contact?.length;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditDetails = (contact) => {
    setSelectedEdit(contact);
    setIsEditModalOpen(true);
  };

  const handleDelete = (contact) => {
    setSelectedEdit(contact);
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

  // Filter data based on search term
  const filteredData = data?.contact?.filter((contact) =>
    `$ ${contact.email} ${contact.mobileno}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle />
        <div className="container-box px-0">
          <div className="container-box-top-header px-4">
            <div className="container-box-top-header-left-2">
              <input
                type="search"
                name="search"
                placeholder="Search by email and mobileno"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>

          <div className="container-box-inner">
            <table id="example" className="table" style={{ width: "100%" }}>
              <thead>
                <tr className="trs">
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Mobile No</th>
                  <th>Description</th>
                  <th>Status</th>
                  {/* <th>Edit</th> */}
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((contact, i) => (
                  <tr key={contact._id}>
                    <td>{i + 1}</td>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.mobileno}</td>
                    <td>{contact.description}</td>
                    <td className="status-toggle">
                    <HelpTogal
                      help={contact}
                      page="contact"
                      onSuccess={() => run()}
                    />
                  </td>
                    {/* <td>
                      <button
                        className="view-details-btn"
                        onClick={() => handleEditDetails(contact)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td> */}
                    <td>
                      <button
                        className="viewdelete"
                        onClick={() => handleDelete(contact)}
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

        {/* Uncomment and implement modals below if needed */}
        {/* <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Contact"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <contactUpdate
            contact={selectedEdit}
            closeModal={closeEditModal}
            onSuccess={run}
          />
        </Modal> */}

        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <ContactButton
            data={selectedEdit}
            page="contact"
            closeModal={closeDeleteModal}
            onSuccess={run}
          />
        </Modal>
      </div>
    </>
  );
}

export default Conatct;
