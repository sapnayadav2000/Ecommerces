import { Link, useNavigate } from "react-router-dom";
import Pagetitle from "../viewmodel/pagetitle";
import React, { useState, useEffect } from "react";
import SubCategoryServices from "../../services/addSubCategory";
import CategoryServices from "../../services/categoryServices";

function AddSubCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState("img/placeholder-img.svg");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryServices.getCategory(); // Adjust API call as needed
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = categories.find(
      (cat) => cat._id === event.target.value
    );
    setFormValues({
      ...formValues,
      Category: selectedCategory._id,
      Categoryname: selectedCategory.name,
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }
      await SubCategoryServices.createSubCategory(formData);
      alert("SubCategory created successfully");
      navigate("/sub-category");
    } catch (error) {
      console.error("Failed to create SubCategory", error);
      alert("Failed to create SubCategory");
    }
  };

  return (
    <div className="right_col" role="main">
      <Pagetitle />

      <div className="container-box">
        <div className="container-box-top-header justify-content-end px-4">
          <div className="sub-title-box-right">
            <Link className="site-btn-green" to="/sub-category" style={{ width: '200px' }}>
              <i className="fa fa-arrow-left mr-2"></i>Sub Category List
            </Link>
          </div>
        </div>

        <div className="container-box-inner px-4">
          <div className="page-details">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">

                {/* Select Category */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control form-select border"
                      name="Category"
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((category) => category.status === "Active")
                        .map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Subcategory Name */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter Subcategory Name"
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="col-md-6">
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

                {/* Description */}
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter Description"
                      className="form-control"
                      rows={4}
                    />
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

  );
}

export default AddSubCategory;
