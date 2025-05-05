import Pagetitle from "./pagetitle";
import HelpTogal from "../Togal/HelpTogal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import useAsync from "../../Hooks/useAsync";
import Pincodeservices from "../../services/pincode.js";
import { useState } from "react";
import Modal from "react-modal";
import PincodeUpdate from "../update/pincodeUpdate.js";
import DeleteButton from "../delete/deleteButton.js";
Modal.setAppElement("#root");
function Pincode() {
  const { data, run } = useAsync(Pincodeservices.getPincode);
  console.log('pincode data',data);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const filteredData = data?.data?.filter((pincode) =>
    `${pincode.pincode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEdit(null);
  };
  const handleDelete = (pincode) => {
    setSelectedEdit(pincode);
    setIsDeleteModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEdit(null);
  };

  const handleEditDetails = (pincode) => {
    setSelectedEdit(pincode);
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
                placeholder="Search by pincode"
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
                to="/add-pincode"
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
                  <th scope="col">Pincode</th>
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Country</th>
                  <th scope="col">STATUS</th>
                  <th scope="col">EDIT</th>
                  <th scope="col">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((pincode, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{pincode.pincode}</td>
                    <td>{pincode.city}</td>
                    <td>{pincode.state}</td>
                    <td>{pincode.country}</td>
                   
                    <td className="status-toggle">
                      <HelpTogal
                        help={pincode}
                        page="pincode"
                        onSuccess={() => run()}
                      />
                    </td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => handleEditDetails(pincode)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                    <td>
                      <button
                        className="viewdelete"
                        onClick={() => handleDelete(pincode)}
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
          <PincodeUpdate
            pincode={selectedEdit}
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
            page="pincode"
            closeModal={closeDeleteModal}
            onSuccess={run}
          />
        </Modal>
      </div>
    </>
  );
}

export default Pincode;
