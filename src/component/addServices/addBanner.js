import React, { useState, useEffect } from "react";
import Pagetitle from "../viewmodel/pagetitle.js";
import HomesliderServices from "../../services/homesliderservices .js";

import { Link, useNavigate } from "react-router-dom";
function AddBanner() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    message: "",
    startDate: "",
    image: "",
    endDate: "",
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
    setStartDate(event.target.value);
    setEndDate(event.target.value);
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

      await HomesliderServices.createBanner(formData);
      alert("Banner created successfully");

      navigate("/banner");
    } catch (error) {
      console.error("Failed to create Banner", error);
      alert("Failed to create ");
    }
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Get current date in the proper format
    setCurrentDate(formattedDate);
    setStartDate(formattedDate); // Set default start date to today
  }, []);

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box">
          <div className="container-box-top-header justify-content-end">
            <div className="sub-title-box-right">
              <Link className="site-btn-green me-5" to="/banner">
                Banner List
              </Link>
            </div>
          </div>
          <div className="container-box-inner px-4">
            <div className="page-details">
              <form onSubmit={handleSubmit}>
                <div className="row ">
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Tittle*</label>
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

                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Message*</label>
                      <input
                        type="text"
                        name="message"
                        value={formValues.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter  Message"
                        className="form-control"
                      />
                    </div>
                  </div>
               
                  <div className="col-lg-6 col-md-6">
                    <div className="input-field">
                      <label  className="pt-3" for="">Select a StartDate*</label>
                      <input
                        type="date"
                        class="form-control"
                        name="startDate"
                        placeholder="Pick a date"
                        min={currentDate}
                        value={startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="input-field">
                      <label className="pt-3" for="">Select a EndDate*</label>
                      <input
                        type="date"
                        class="form-control"
                        name="endDate"
                        placeholder="Pick a date"
                        min={startDate}
                        onChange={handleInputChange}
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

export default AddBanner;
