import React, { useState } from "react";
import Pagetitle from "../viewmodel/pagetitle";
import CategoryServices from "../../services/categoryServices";
import { Link, useNavigate } from "react-router-dom";
function AddCategory() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
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
      await CategoryServices.createCategory(formData);
      alert("Category created successfully");

      navigate("/category");
    } catch (error) {
      console.error("Failed to create Category", error);
      alert("Failed to create category ");
    }
  };

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle />

        <div className="container-box">
          <div className="container-box-top-header justify-content-end px-4">
            <div className="sub-title-box-right">
              <Link className="site-btn-green" to="/category">
                <i className="fa fa-arrow-left mr-2"></i>Category List
              </Link>
            </div>
          </div>

          <div className="container-box-inner px-4">
            <div className="page-details">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Category Name */}
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Category Name"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label className="form-label">
                        Upload Image <small>(Size should be 343 x 160)</small> *
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
                      SUBMIT
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default AddCategory;
