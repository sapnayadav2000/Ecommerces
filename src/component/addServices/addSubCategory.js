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
        <div className="container-box-top-header justify-content-end">
          <div className="sub-title-box-right">
            <Link className="site-btn-green me-4" to="/sub-category">
              Sub Category List
            </Link>
          </div>
        </div>
        <div className="container-box-inner px-4">
          <div className="page-details">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="input-field">
                    <label className="pt-3">Category*</label>
                    <select
                      className="form-control"
                      name="Category"
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select Category</option>

                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-7">
                  <div className="input-field">
                    <label className="pt-3">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter name"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="input-field">
                    <label className="pt-3">
                      Upload Image* <small>(Size should be 343 x 160)</small>
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    <div className="file-preview">
                      <img id="uploadFile" src={previewImage} alt="Preview" />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="input-field">
                    <label className="pt-3">Description*</label>
                    <textarea
                      name="description"
                      value={formValues.description}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter description"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <button className="sited-btn">SUBMIT</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubCategory;
