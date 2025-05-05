import React, { useState, useEffect } from "react";
import ReturnServices from "../../services/returnServices";

function ReturnUpdate({ returns, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    reason:"",
    description:"",
  });

  useEffect(() => {
    if (returns) {
      setFormValues({
        reason: returns?.reason || "",
        description: returns?.description || "",
      })
      
    }
  }, [returns]);


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
      const data = {
        reason: formValues.reason,
        description: formValues.description,
      };
  
      await ReturnServices.updateReturn(returns._id, data);
      alert("updated Data successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      alert("Failed to update return");
      console.error(error);
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
            <h5 className="modal-title"> Edit returns</h5>
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
                          <label className="pt-3">Reason</label>
                          <input
                            type="text"
                            name="reason"
                            className="form-control"
                            value={formValues.reason}
                            onChange={handleInputChange}
                            placeholder="title"
                          />
                        </div>
                      </div>

                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Description</label>
                          <input
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

export default ReturnUpdate;
