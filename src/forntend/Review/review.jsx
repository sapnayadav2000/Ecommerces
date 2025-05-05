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
        <h2 className="mb-4">Leave a Review</h2>

        {/* Image Upload Section */}
        <div className="mb-3">
          <label>Upload Images</label>
          <input
            type="file"
            name="images"
            multiple
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview Images */}
        <div className="file-preview d-flex flex-wrap">
          {previewimages.length > 0 ? (
            previewimages.map((imgSrc, index) => (
              <div key={index} className="position-relative m-2">
                <img
                  src={imgSrc}
                  alt={`Preview ${index}`}
                  className="img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute"
                  style={{ top: 0, right: 0 }}
                  onClick={() => handleDeleteImage(index)}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <img
              src="img/placeholder-img.svg"
              alt="Placeholder"
              className="img-thumbnail"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-star fa-3x me-2 ${
                    rating >= star ? "fas text-warning" : "far text-muted"
                  }`}
                  onClick={() => handleClick(star)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label>Comment</label>
            <textarea
              className="form-control"
              rows="4"
              value={description}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Review;
