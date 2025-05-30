import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ReviewService from "../../services/reviewServices";

function ReviewUpdate({ review, onSuccess, closeModal }) {
  const [previewImages, setPreviewImages] = useState(["img/placeholder-img.png"]);
  const [formValues, setFormValues] = useState({
    _id: "",
    rating: "",
    images: [],
    description: ""
  });

  useEffect(() => {
    if (review) {
      setFormValues({
        _id: review?._id || "",
        rating: review?.rating || "",
        images: review?.images || [],
        description: review?.description || ""
      });

      if (review.images && review.images.length > 0) {
        setPreviewImages(
          review.images.map((img) => `${process.env.REACT_APP_API_BASE_URL}/${img}`)
        );
      }
    }
  }, [review]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const filePreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...filePreviews]);
      setFormValues({ ...formValues, images: [...formValues.images, ...files] });
    }
  };

  const handleImageDelete = async (index, imagePath) => {
    try {
      const reviewId = formValues._id;

      if (!reviewId) {
        alert("Review ID is missing!");
        return;
      }

      await ReviewService.deleteImage(imagePath, reviewId); // Backend must support this
      const updatedImages = formValues.images.filter((_, i) => i !== index);
      const updatedPreviews = previewImages.filter((_, i) => i !== index);

      setFormValues({ ...formValues, images: updatedImages });
      setPreviewImages(updatedPreviews);
    } catch (error) {
      console.error("Failed to delete image", error);
      alert("Failed to delete image");
    }
  };

  const handleRatingChange = (rating) => {
    setFormValues({
      ...formValues,
      rating
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      // Append non-image fields
      formData.append("rating", formValues.rating);
      formData.append("description", formValues.description);

      // Append images
      formValues.images.forEach((image) => {
        formData.append("images", image);
      });

      await ReviewService.updateReview(formValues._id, formData);

      alert("Review updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review");
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
            <h5 className="modal-title">Edit Review</h5>
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
                      {/* Rating */}
                      <div className="col-md-6">
                        <div className="input-field">
                          <label className="pt-3">Rating</label>
                          <div className="d-flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                                className={`fa-lg ${formValues.rating >= star ? 'text-warning' : 'text-muted'}`}
                                onClick={() => handleRatingChange(star)}
                                style={{ cursor: "pointer" }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-md-12">
                        <div className="input-field">
                          <label className="pt-3">Description</label>
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

                      {/* Image Upload */}
                      <div className="col-lg-6 col-md-6">
                        <div className="input-field">
                          <label className="pt-3">
                            Upload Images* <small>(Supports multiple files)</small>
                          </label>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="form-control"
                          />
                          <div className="file-preview d-flex flex-wrap">
                            {previewImages.map((img, index) => (
                              <div key={index} className="position-relative m-1">
                                <img
                                  src={img}
                                  alt="Preview"
                                  className="img-thumbnail"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover"
                                  }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                  onClick={() =>
                                    handleImageDelete(index, formValues.images[index])
                                  }
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
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

export default ReviewUpdate;
