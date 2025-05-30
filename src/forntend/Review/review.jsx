import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { toast } from "react-toastify";
import ProductServices from "../../services/productServices";
import ReviewServices from "../../services/reviewServices";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [description, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previewimages, setPreviewimages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ProductServices.getProductById(id);
        setProduct(res?.data || {});
      } catch (err) {
        toast.error("Product not found");
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !description.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }

    const formData = new FormData();
    formData.append("productId", id);
    formData.append("userId", user?._id);
    formData.append("username", user?.name);
    formData.append("rating", rating);
    formData.append("description", description);

    images.forEach((file) => {
      formData.append("images", file); // key should match multer.array('images')
    });

    try {
      await ReviewServices.createReview(formData);
      toast.success("Review submitted!");
      navigate("/Your-Orders");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  const handleClick = (value) => {
    setRating(value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewimages((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...files]);
  };

  const handleDeleteImage = (index) => {
    const updatedPreviews = [...previewimages];
    const updatedFiles = [...images];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setPreviewimages(updatedPreviews);
    setImages(updatedFiles);
  };

  return (
    <>
      <HomeHeader />
      <div className="container py-5">
        <div className="p-4 rounded-4 shadow-lg bg-white">
          <h2 className="text-center mb-4 fw-bold">Leave a Review</h2>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Upload Images</label>
            <input
              type="file"
              name="images"
              multiple
              className="form-control rounded-3 shadow-sm"
              onChange={handleFileChange}
            />
          </div>

          {/* Image Preview Section */}
          <div className="file-preview d-flex flex-wrap mb-4 gap-3">
            {previewimages.length > 0 ? (
              previewimages.map((imgSrc, index) => (
                <div
                  key={index}
                  className="position-relative rounded-3 border"
                  style={{ width: "100px", height: "100px", overflow: "hidden" }}
                >
                  <img
                    src={imgSrc}
                    alt={`Preview ${index}`}
                    className="img-fluid"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger rounded-circle position-absolute"
                    style={{
                      top: "-8px",
                      right: "-8px",
                      padding: "0 6px",
                      fontSize: "12px",
                      zIndex: 2,
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <img
                src="/img/placeholder-img.svg"
                alt="Placeholder"
                className="img-thumbnail"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Your Rating</label>
              <div className="d-flex align-items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star fa-2x ${rating >= star ? "fas text-warning" : "far text-secondary"
                      }`}
                    onClick={() => handleClick(star)}
                    style={{ cursor: "pointer", transition: "color 0.2s ease" }}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Your Comment</label>
              <textarea
                className="form-control rounded-3 shadow-sm"
                rows="4"
                placeholder="Tell us about your experience..."
                value={description}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-lg px-5  text-white"
                style={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Review;
