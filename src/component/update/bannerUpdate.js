import React, { useState, useEffect } from "react";
import HomesliderServices from "../../services/homesliderservices ";

function BannerUpdate({ Banner, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    title: "",
    message: "",
    startDate: "",
    image: "",
    endDate: "",
  });
useEffect(() => {
  if (Banner) {
    const formatDate = (dateStr) => {
      return new Date(dateStr).toISOString().split("T")[0];
    };

    setFormValues({
      title: Banner?.title || "",
      message: Banner?.message || "",
      startDate: formatDate(Banner?.startDate),
      image: Banner?.image || "",
      endDate: formatDate(Banner?.endDate),
    });

    if (Banner.image) {
      setPreviewImage(`${process.env.REACT_APP_API_BASE_URL}/${Banner.image}`);
    }
  }
}, [Banner]);


  const [previewImage, setPreviewImage] = useState("img/placeholder-img.png"); // Placeholder image path

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setStartDate(event.target.value);
    setEndDate(event.target.value);
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

      await HomesliderServices.updateBanner(Banner.id, formData);
      alert("Banner updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      alert("Failed to update Banner");
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
            <h5 className="modal-title"> Edit Banner</h5>
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
                          <label className="pt-3">Title</label>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formValues.title}
                            onChange={handleInputChange}
                            placeholder="title"
                          />
                        </div>
                      </div>

                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3"> Message</label>
                          <input
                            type="text"
                            name="message"
                            value={formValues.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter "
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label  className="pt-3" for="">Select a StartDate</label>
                          <input
                            type="date"
                            class="form-control"
                            name="startDate"
                            placeholder="Pick a date"
                            // min={currentDate}
                            value={formValues.startDate}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label for="" className="pt-3">Select a EndDate</label>
                          <input
                            type="date"
                            class="form-control"
                            name="endDate"
                            placeholder="Pick a date"
                            min={startDate}
                            onChange={handleInputChange}
                            value={formValues.endDate}
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
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

                          <div className="file-preview text-center ">
                            <img
                              id="uploadFile"
                              src={previewImage}
                              alt="your image"
                            />
                          </div>
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

export default BannerUpdate;
