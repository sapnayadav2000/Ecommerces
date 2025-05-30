import React, { useState, useEffect } from "react";
import SubCategoryServices from "../../services/addSubCategory";
import CategoryServices from "../../services/categoryServices";
function SubCategorynUpdate({ subcat, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    Category: "",
    image: "",
    status: "Active",
  });

  const [previewImage, setPreviewImage] = useState("img/placeholder-img.png"); // Placeholder image path
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (subcat) {
      setFormValues({
        name: subcat?.name || "",
        description: subcat?.description || "",
        Category: subcat?.Category || "",
        image: subcat?.image || "",
      });
      if (subcat.image) {
        setPreviewImage(
          `${process.env.REACT_APP_API_BASE_URL}/${subcat.image}`
        );
      }
    }
  }, [subcat]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        if (key !== "image" || formValues[key] instanceof File) {
          formData.append(key, formValues[key]);
        }
      }

      await SubCategoryServices.updateSubCategory(subcat._id, formData);
      alert("Updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      alert("Failed to update");
    }
  };

  return (
    <div
      className="modal fade edit-box show d-block"
      id="editModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit SubCategory</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={closeModal}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="container-box px-5">
              <div className="container-box-inner">
                <div className="page-details">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className=" pt-3">Category</label>
                          <select
                            className="form-control border"
                            name="Category"
                            value={formValues.Category}
                            onChange={handleCategoryChange}

                          >
                            <option value="" >Select Category</option>

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
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formValues.name}
                            onChange={handleInputChange}
                            placeholder="Enter Name"
                          />
                        </div>
                      </div>
                      <div className="col-sm-15">
                        <div className="input-field">
                          <label className="pt-3">Description</label>
                          <textarea
                            type="text"
                            name="description"
                            value={formValues.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter "
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">
                            Upload <span className="red">*</span>
                          </label>
                          <input
                            type="file"
                            name="image"
                            className="form-control"
                            onChange={handleFileChange}
                          />
                          <div className="file-preview text-center">
                            <img
                              id="uploadFile"
                              src={previewImage}
                              alt="Preview"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="sited-btn-green">Update</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubCategorynUpdate;
