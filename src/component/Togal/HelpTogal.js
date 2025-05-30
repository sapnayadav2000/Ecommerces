import React, { useState } from "react";
import HomesliderServices from "../../services/homesliderservices ";
import Notificationservices from "../../services/notificationServices";
import CategoryServices from "../../services/categoryServices";
import SubCategoryServices from "../../services/addSubCategory";
import BrandService from "../../services/brandServices";
import Productservices from "../../services/productServices";
import AddressServices from "../../services/adressServices";
import Userservices from "../../services/userservices";
import Reviewservices from "../../services/reviewServices";
import Conatctservices from "../../services/conatctServices";
import Pincodeservices from "../../services/pincode";
import ReturnServices from "../../services/returnServices";
import BlogServices from "../../services/blogServices";
const HelpTogal = ({ help, page, onSuccess }) => {
  // Initialize the state based on the user's status
  const [isChecked, setIsChecked] = useState(help?.status === "Active");


  // Handle checkbox toggle
  const handleToggle = async () => {
    const newStatus = !isChecked ? "Active" : "Inactive";
    setIsChecked(!isChecked);


    if (page === "Banner") {
      const res = await HomesliderServices.updateBanner(help._id, {
        status: newStatus,
      });
      onSuccess();
    } else if (page === "Notification") {
      const res = await Notificationservices.updateNotification(help._id, {
        status: newStatus,
      });
      onSuccess();
    } else if (page === "cat") {
      const res = await CategoryServices.updateCategory(help._id, {
        status: newStatus,
      });
      onSuccess();
    } else if (page === "subcat") {
      const res = await SubCategoryServices.updateSubCategory(help._id, {
        status: newStatus,
      });
      onSuccess();
    } else if (page === "brand") {
      const res = await BrandService.updatebrand(help._id, {
        status: newStatus,
      });
      onSuccess();
    }
    else if (page === "blog") {
      const res = await BlogServices.updateblog(help._id, {
        status: newStatus,
      });
      onSuccess();
    } else if (page === "product") {
      const res = await Productservices.updateproduct(help._id, {
        status: newStatus,
      });
      onSuccess();
    }
    else if (page === "address") {
      const res = await AddressServices.updateAddress(help._id, {
        status: newStatus,
      });
      onSuccess();
    }
    else if (page === "user") {
      const res = await Userservices.UpdatedUser(help._id, {
        status: newStatus,
      });
      onSuccess();
    }
    else if (page === "review") {
      const res = await Reviewservices.updateReview(help._id, {
        status: newStatus,
      });
      onSuccess();
    }

    else if (page === "contact") {
      const res = await Conatctservices.updatedContact(help._id, {
        status: newStatus,
      });
      onSuccess();
    }
    else if (page === "pincode") {
      const res = await Pincodeservices.updatePincode(help._id, {
        status: newStatus,
      });
      onSuccess();
    }

    else if (page === "returns") {
      const res = await ReturnServices.updateReturn(help._id, {
        status: newStatus,
      });
      onSuccess();
    }

  };

  return (
    <>
      <div className="check-box">
        <input type="checkbox" checked={isChecked} onChange={handleToggle} />
        <div class="handle"></div>
      </div>
    </>
  );
};

export default HelpTogal;
