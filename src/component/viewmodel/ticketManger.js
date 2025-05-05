import React, { useState, useEffect } from "react";
import Pagetitle from "./pagetitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import ticketServices from "../../services/ticketServices";
import useAsync from "../../Hooks/useAsync";
import Modal from "react-modal";
import DeleteButton from "../delete/deleteButton";


Modal.setAppElement("#root");

function TicketManager() {
  const { data, run } = useAsync(ticketServices.AllTicket);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]); // The state that stores the ticket data

  // Handle modal open for editing
  const handleEditDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };

  // Handle modal open for deletion
  const handleDelete = (ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTicket(null);
  };

  // Close the delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTicket(null);
  };

  // Handle search term input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter tickets based on search term
  const filteredTickets = (data || []).filter(
    (ticket) =>
      ticket?.Issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket?.mobileno?.toString().includes(searchTerm)
  );

  // Update ticket list when data changes
  useEffect(() => {
    if (data) {
      setTickets(data);
    }
  }, [data]);

  // Handle priority change
  const handlePriorityChange = (ticketId, newPriority) => {
    if (!tickets || !Array.isArray(tickets)) {
      console.error("Tickets data is invalid");
      return;
    }

    const ticketToUpdate = tickets.find((t) => t._id === ticketId);
    if (!ticketToUpdate) {
      console.error("Ticket not found!");
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket
      )
    );

    const updatedData = {
      priority: newPriority,
      status: ticketToUpdate?.status || "Pending",
    };

    ticketServices
      .updatePriority(ticketId, updatedData)
      .then(() => alert("Priority updated!"))
      .catch(() => alert("Failed to update priority."));
  };

  // Handle status change
  const handleStatusChange = (ticketId, newStatus) => {
    if (!tickets || !Array.isArray(tickets)) {
      console.error("Tickets data is invalid");
      return;
    }

    const ticketToUpdate = tickets.find((t) => t._id === ticketId);
    if (!ticketToUpdate) {
      console.error("Ticket not found!");
      return;
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );

    const updatedData = {
      status: newStatus,
    };

    ticketServices
      .updatePriority(ticketId, updatedData)
      .then(() => alert("Status updated!"))
      .catch(() => alert("Failed to update status."));
  };

  return (
    <div className="right_col" role="main">
      <Pagetitle />
      <div className="container-box px-0">
        <div className="container-box-top-header px-4">
          <div className="container-box-top-header-left-2">
            <input
              type="search"
              name="search"
              placeholder="Search by Issue Type or Mobile No"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-btn">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <div className="container-box-inner">
          <table className="table" style={{ width: "100%" }}>
            <thead>
              <tr className="trs">
                <th>#</th>
                <th>Image</th>
                <th>Issue Type</th>
                <th>Mobile No</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created At</th>

                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {(filteredTickets || []).map((ticket, i) => (
                <tr key={ticket._id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="product-img">
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/${ticket?.image}`}
                        alt="image"
                        style={{
                          height: "70px",
                          width: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </td>
                  <td>{ticket.Issue_type}</td>
                  <td>{ticket.mobileno}</td>
                  <td className="status-toggle">
                    <select
                      value={ticket.priority}
                      onChange={(e) =>
                        handlePriorityChange(ticket._id, e.target.value)
                      }
                      style={{
                        backgroundColor:
                          ticket.priority === "Low"
                            ? "rgb(249, 184, 66)"
                            : ticket.priority === "Medium"
                            ? "rgb(105, 152, 54)"
                            : "rgb(255, 51, 51)", // High
                        color: "#fff",
                      }}
                      className="form-select"
                    >
                      <option
                        value="Low"
                        style={{ backgroundColor: "rgb(249, 184, 66)" }}
                      >
                        Low
                      </option>
                      <option
                        value="Medium"
                        style={{ backgroundColor: "rgb(105, 152, 54)" }}
                      >
                        Medium
                      </option>
                      <option
                        value="High"
                        style={{ backgroundColor: "rgb(255, 51, 51)" }}
                      >
                        High
                      </option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(ticket._id, e.target.value)
                      }
                      style={{
                        backgroundColor:
                          ticket.status === "In Progress"
                            ? "rgb(249, 184, 66)"
                            : ticket.status === "Resolved"
                            ? "rgb(105, 152, 54)"
                            : "rgb(255, 51, 51)", // Closed
                        color: "#fff",
                      }}
                      className="form-select"
                    >
                      <option
                        value="In Progress"
                        style={{ backgroundColor: "rgb(249, 184, 66)" }}
                      >
                        In Progress
                      </option>
                      <option
                        value="Resolved"
                        style={{ backgroundColor: "rgb(105, 152, 54)" }}
                      >
                        Resolved
                      </option>
                      <option
                        value="Closed"
                        style={{ backgroundColor: "rgb(255, 51, 51)" }}
                      >
                        Closed
                      </option>
                    </select>
                  </td>

                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>

                  <td>
                    <button
                      className="viewdelete"
                      onClick={() => handleDelete(ticket)}
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

      {/* Edit Ticket Modal */}

      {/* Delete Ticket Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Ticket"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <DeleteButton
          data={selectedTicket}
          page="ticket"
          closeModal={closeDeleteModal}
          onSuccess={run}
        />
      </Modal>
    </div>
  );
}

export default TicketManager;
