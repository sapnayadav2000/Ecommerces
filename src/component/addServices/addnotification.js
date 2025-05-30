import { Link, useNavigate } from "react-router-dom";
import Pagetitle from "../viewmodel/pagetitle";
import React, { useState } from "react";
import Notificationservices from "../../services/notificationServices";

function AddNotification() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    message: "",
    image: "",
    status: "Active",
  });

  const [previewImage, setPreviewImage] = useState("img/placeholder-img.svg"); // Placeholder image path

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormValues({
        ...formValues,
        image: file,
      });
    }
  };

  //   // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }

      await Notificationservices.createNotification(formData);
      alert("Notification created successfully");

      navigate("/notification");
    } catch (error) {
      console.error("Failed to create Notification", error);
      alert("Failed to create Notification");
    }
  };
  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle />

        <div className="container-box shadow-sm rounded p-4 bg-white">

          <div className="container-box-top-header justify-content-end px-4">
            <div className="sub-title-box-right">
              <Link className="site-btn-green" to="/notification" style={{ width: '180px' }}>
                <i className="fa fa-arrow-left mr-2"></i> Notification List
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Title Field */}
              <div className="col-lg-4 col-md-6">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formValues.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter Title"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="col-lg-4 col-md-6">
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <input
                    type="text"
                    name="message"
                    value={formValues.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter Message"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-md-6 col-lg-6">
                <div className="form-group">
                  <label className="form-label">
                    Upload Image <small>(343 x 160)</small> *
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="form-control"
                    required
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", height: "auto" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-12">
                <button type="submit" className="sited-btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </>
  );
}

export default AddNotification;
