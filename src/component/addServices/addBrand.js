import React, { useState } from "react";
import Pagetitle from "../viewmodel/pagetitle";
import BrandService from "../../services/brandServices";
import { Link, useNavigate } from "react-router-dom";
function AddBrand() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    image: "",
   
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
      await BrandService.createbrand(formData);
      alert("Brand created successfully");

      navigate("/brand");
    } catch (error) {
      console.error("Failed to create  brand", error);
      alert("Failed to create  brand");
    }
  };

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box">
          <div className="container-box-top-header justify-content-end">
            <div className="sub-title-box-right">
              <Link className="site-btn-green me-4" to="/brand">
                Brand List
              </Link>
            </div>
          </div>
          <div className="container-box-inner px-4">
            <div className="page-details">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
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
                        Upload Image*<small>(Size should be 343 x 160)</small>
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="form-control"
                      />
                      <div className="file-preview">
                        <img id="uploadFile" src={previewImage} alt=" " />
                      </div>
                    </div>
                  </div>
                </div>
                <button className="sited-btn">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddBrand;
