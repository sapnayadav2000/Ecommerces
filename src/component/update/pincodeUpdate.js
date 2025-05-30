import React, { useState, useEffect } from "react";
import Pincodeservices from "../../services/pincode";

function PincodeUpdate({ pincode, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    pincode: "",
    city: "",
    state: "",
    country: "",

  });

  useEffect(() => {
    if (pincode) {
      setFormValues({
        pincode: pincode?.pincode || "",
        city: pincode?.city || "",
        state: pincode?.state || "",
        country: pincode?.country || "",
      });

    }
  }, [pincode]);



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Pincodeservices.updatePincode(pincode._id, formValues);
      alert("Pincode updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to update pincode");
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
      <div className="modal-dialog modal-dialog-centered   modal-dialog-scrollable ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"> Edit Pincode</h5>
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
                          <label className="pt-3">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            className="form-control"
                            value={formValues.pincode}
                            onChange={handleInputChange}
                            placeholder="pincode"
                            maxLength="6"
                          />
                        </div>
                      </div>

                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formValues.city}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter city "
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formValues.state}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter State "
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formValues.country}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter country "
                            className="form-control"
                          />
                        </div>
                      </div>




                    </div>
                    <button className="sited-btn-green">Update </button>
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

export default PincodeUpdate;
