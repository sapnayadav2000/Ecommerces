import React from "react";
import HomesliderServices from "../../services/homesliderservices ";
import Notificationservices from "../../services/notificationServices";
import CategoryServices from "../../services/categoryServices";
import SubCategoryServices from "../../services/addSubCategory";
import BrandServices from "../../services/brandServices";
import ProductServices from "../../services/productServices";
import UserServices from "../../services/userservices";
import BlogService from "../../services/blogServices";
import TicketServices from "../../services/ticketServices";
import ReviewServices from "../../services/reviewServices";
import PincodeServices from "../../services/pincode";
import ReturnServices from "../../services/returnServices";
import ContactServices from "../../services/conatctServices";
function DeleteBanner({ data, page, closeModal, onSuccess }) {
  const handleDelete = async () => {
    if (page === "banner") {
      const res = await HomesliderServices.deleteBanner(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    } else if (page === "notification") {
      const res = await Notificationservices.deleteNotification(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    } else if (page === "cat") {
      const res = await CategoryServices.deleteCategory(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    } else if (page === "subcat") {
      const res = await SubCategoryServices.deletesubCategory(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    } else if (page === "brand") {
      const res = await BrandServices.deletebrand(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    } else if (page === "product") {
      const res = await ProductServices.deleteproduct(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }

    else if (page === "blog") {
      const res = await BlogService.deletebrand(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }
    else if (page === "user") {
      const res = await UserServices.deleteuser(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }
    else if (page === "ticket") {
      const res = await TicketServices.DeleteTicket(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }
    else if (page === "review") {
      const res = await ReviewServices.deleteReview(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }
    else if (page === "pincode") {
      const res = await PincodeServices.deletePincode(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }

    else if (page === "returns") {
      const res = await ReturnServices.DeleteReturn(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }

    else if (page === "contact") {
      const res = await ContactServices.DeleteContact(data._id);

      if (res.status === false) {
        console.log(res);
      } else {
        alert("Data deleted successfully");
        onSuccess();
        closeModal();
      }
    }



  };

  return (
    <div
      className="modal fade show d-block"
      id="deleteACModel"
      tabIndex="-1"
      aria-labelledby="deleteACModelLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
<div style={{
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '200px',
  pointerEvents: 'auto',
  backgroundColor: '#ffffff',
  backgroundClip: 'padding-box',
  border: '1px solid black',

}}>
          {/* Close (X) Button */}
          <button
            type="button"
            onClick={closeModal}
            className="btn-close"
            aria-label="Close"
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "transparent",
              border: "none",
              fontSize: "1.4rem",
              color: "#000",
              zIndex: 10,
             
            }}
          >
            &times;
          </button>

          <div
            className="modal-body text-center"
            style={{
              backgroundColor: "#f9f9f9",
              padding: "2rem 2.5rem",

            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>

              <h4 style={{ fontWeight: "600", color: "#333" }}>Delete this Item?</h4>
              <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "15px" }}>
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn"
                onClick={closeModal}
                style={{
                  minWidth: "100px",
                  border: '1px solid rgb(150, 186, 110)',
                  borderRadius: "6px",
                  backgroundColor: 'rgb(150, 186, 110)',
                }}
              >
                Cancel
              </button>

              <button
                className="btn "
                onClick={handleDelete}
                style={{
                  minWidth: "100px",
                  backgroundColor: "#f46f6f",
                  borderRadius: "6px",
                  border: '1px solid #f46f6f'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

export default DeleteBanner;
