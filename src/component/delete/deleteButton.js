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
        <div className="modal-content modal-bg-light-green">
          <div className="modal-body py-4 px-5 text-center">
            <h4>Delete this Item?</h4>
            <p className="desc my-2">
              Are you sure you want to delete this Item? This action cannot be
              undone.
            </p>
            <div className="footer-btn-grp text-center py-4">
              <button className="sites-btn btn-o" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="sites-btn  delete-btn"
                onClick={handleDelete}
                style={{ backgroundColor: "red" }}
              >
                Delete{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteBanner;
