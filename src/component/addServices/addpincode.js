import { Link, useNavigate } from "react-router-dom";
import Pagetitle from "../viewmodel/pagetitle";
import React, { useState } from "react";
import Pincodeservices from "../../services/pincode";

function AddPincode() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    pincode: "",
    city: "",
    state: "",
    country: "",
    status: "Active",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "pincode") {
      // Allow only digits, max length 6
      if (/^\d{0,6}$/.test(value)) {
        setFormValues({
          ...formValues,
          [name]: value,
        });
      }
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formValues.pincode.length !== 6) {
      alert("Pincode must be exactly 6 digits");
      return;
    }

    try {
      await Pincodeservices.createPincode(formValues);
      alert("Pincode created successfully");
      navigate("/pincode");
    } catch (error) {
      console.error("Failed to create Pincode", error);
      alert("Failed to create Pincode");
    }
  };


  return (
    <div className="right_col" role="main">
      <Pagetitle />
      <div className="container-box">
        <div className="container-box-top-header justify-content-end px-4">
          <div className="sub-title-box-right">
            <Link className="site-btn-green " to="/Pincode">
              <i className="fa fa-arrow-left mr-2"></i><span>Pincode List</span>
            </Link>
          </div>
        </div>
        <div className="container-box-inner px-4">
          <div className="page-details">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="input-field">
                    <label className="pt-3">Pincode*</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formValues.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter pincode"
                      className="form-control"
                      maxLength={6}
                      pattern="\d{6}"
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="input-field">
                    <label className="pt-3">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formValues.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter city"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="input-field">
                    <label className="pt-3">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formValues.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter state"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="input-field">
                    <label className="pt-3">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formValues.country}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter country"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <button className="sited-btn" type="submit">
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPincode;
