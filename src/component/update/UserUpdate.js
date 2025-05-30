import React, { useState, useEffect } from "react";
import UserServices from "../../services/userservices";

function UserUpdate({ user, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        mobileNo: user?.mobileNo || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.pincode || "",
        password: "", // Keep empty unless updated
      });
    }
  }, [user]);

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
      const payload = { ...formValues };

      // Remove empty fields (so old values don't get overwritten with empty strings)
      Object.keys(payload).forEach((key) => {
        if (!payload[key]) delete payload[key];
      });

      await UserServices.UpdatedUser(user._id, payload);
      alert("User updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      alert("Failed to update user");
    }
  };

  return (
    <div className="modal fade edit-box show d-block" id="editModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={closeModal} aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="container-box px-5">
              <div className="container-box-inner">
                <div className="page-details">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">First Name</label>
                          <input type="text" name="firstName" className="form-control" value={formValues.firstName} onChange={handleInputChange} placeholder="Enter name" required />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">Last Name</label>
                          <input type="text" name="lastName" className="form-control" value={formValues.lastName} onChange={handleInputChange} placeholder="Enter name" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">Email</label>
                          <input type="email" name="email" className="form-control" value={formValues.email} onChange={handleInputChange} placeholder="Enter email" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">Mobile No</label>
                          <input type="text" name="mobileNo" className="form-control" value={formValues.mobileNo} onChange={handleInputChange} placeholder="Enter mobile number" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">Address</label>
                          <input type="text" name="address" className="form-control" value={formValues.address} onChange={handleInputChange} placeholder="Enter address" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">City</label>
                          <input type="text" name="city" className="form-control" value={formValues.city} onChange={handleInputChange} placeholder="Enter city" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">State</label>
                          <input type="text" name="state" className="form-control" value={formValues.state} onChange={handleInputChange} placeholder="Enter state" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">Pincode</label>
                          <input type="text" name="pincode" className="form-control" value={formValues.pincode} onChange={handleInputChange} placeholder="Enter pincode" required />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="input-field">
                          <label className="pt-3">Password</label>
                          <input type="password" name="password" className="form-control" value={formValues.password} onChange={handleInputChange} placeholder="Enter new password (optional)" />
                        </div>
                      </div>
                    </div>

                    <button className="sited-btn-green mt-3">Update</button>
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

export default UserUpdate;
