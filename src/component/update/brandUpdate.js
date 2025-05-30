import React, { useState, useEffect } from "react";
import BrandServices from "../../services/brandServices";

function BrandUpdate({ brand, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    if (brand) {
      setFormValues({
        name: brand?.name || "",
        image: brand?.image || "",
      });
      if (brand.image) {
        setPreviewImage(`${process.env.REACT_APP_API_BASE_URL}/${brand.image}`);
      }
    }
  }, [brand]);

  const [previewImage, setPreviewImage] = useState("img/placeholder-img.png"); // Placeholder image path

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        if (key !== "image" || formValues[key] instanceof File) {
          formData.append(key, formValues[key]);
        }
      }

      await BrandServices.updatebrand(brand._id, formData);
      alert(" updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      alert("Failed to update ");
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
            <h5 className="modal-title">Edit Brand</h5>
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
                          <label className="pt-3">Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formValues.name}
                            onChange={handleInputChange}
                            placeholder="Enter brand name"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="input-field">
                          <label className="pt-3">
                            Upload<span className="red">*</span>
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
                              alt="your image"
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

export default BrandUpdate;
