import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import productDetailsServices from "../../services/productDetailsServices";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { useCurrency } from "../CurrencyContent";
import AddtoCartServices from "../../services/AddtoCart";
import productServices from "../../services/productServices";
import { Link } from "react-router-dom";
import { BsBasket3 } from "react-icons/bs";
import { FaRegEye, FaRegHeart, FaHeart } from "react-icons/fa";
import wishListServices from "../../services/wishListServices";
import { Modal, Button } from "react-bootstrap";
import Service from "../Service/Service";
import Slider from "react-slick";
import { toast } from "react-toastify";
import ReviewServices from "../../services/reviewServices";
import { useWishlist } from "../../Store/whislist";
import { useCart } from "../../Store/addtoCart";
const ProductDetails = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { fetchWishlistCount } = useWishlist();
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { fetchCartCount } = useCart();
  const { currency } = useCurrency();
  const [selectedPrices, setSelectedPrices] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem("wishlistItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState({
    [selectedProduct?._id]: 0,
  });
  const itemsPerPage = 4;

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);



  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setModalImageIndex((prevState) => ({
        ...prevState,
        [selectedProduct?._id]: 0, // Reset to first image when selectedProduct changes
      }));
    }
  }, [selectedProduct]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await productServices.getproduct();
        const allProducts = response.data;
        // console.log("all products", allProducts);

        const related = allProducts.filter(
          (item) =>
            item._id.toString() !== product._id.toString() && // Exclude current product
            (item.category?.toString() === product.category?.toString() || // Same category
              item.subcategory?.toString() === product.subcategory?.toString()) // Or same subcategory
        );

        console.table(related);

        // Slice to show only the first 4 related products
        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error("Error loading related products:", err);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product, id]);

  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      setLoading(false);
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await productDetailsServices.getById(id);
        if (!response.data) throw new Error("Product not found");

        let productData = response.data;

        if (productData.images && productData.images.length > 0) {
          productData.images = productData.images.map((img) =>
            img.startsWith("http")
              ? img
              : `${process.env.REACT_APP_API_BASE_URL}/${img}`
          );
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  const handleImageError = (e) => {
    e.target.src = "/default-product.jpg";
    e.target.className = "d-block w-100 product-img img-error";
    e.target.alt = "Product image not available";
  };

  const onSizeClick = (productObj, size) => {
    const selectedSize = productObj.productkey?.find(
      (item) => item.Size === size
    );
    if (!selectedSize) return;

    const finalPrice =
      selectedSize.OfferPrice > 0
        ? productObj.price - selectedSize.OfferPrice
        : productObj.price;

    setSelectedPrices((prev) => ({
      ...prev,
      [productObj._id]: finalPrice,
    }));

    setSelectedSizes((prev) => ({
      ...prev,
      [productObj._id]: size,
    }));
  };

  const handleAddToCart = async (product, selectedSize = null) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    // Generate or get existing sessionId for guest user
    if (!localStorage.getItem("sessionId")) {
      localStorage.setItem("sessionId", crypto.randomUUID());
    }
    const sessionId = localStorage.getItem("sessionId");

    if (!selectedSize) return toast.error("Please select a size.");

    const selectedPrice = selectedPrices[product._id] || product.price;

    const body = {
      userId: userId || null, // send null if not logged in
      sessionId,
      productId: product._id,
      quantity: quantity,
      selectedSize,
      price: selectedPrice,
    };

    try {
      const response = await AddtoCartServices.addToCart(body, token);

      if (response?.status === 409) {
        toast.error("This product is already in your cart.");
      } else {
        toast.success("Product added to cart successfully.");
      }
      fetchCartCount();
      console.log("Added to cart:", response);
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Failed to add product to cart.");
    }
  };
  const handleAddToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const isWishlisted = wishlistItems.includes(product._id);

    try {
      if (isWishlisted) {
        await wishListServices.removeFromWishlist(userId, product._id, token);
        setWishlistItems((prev) => prev.filter((id) => id !== product._id));
        toast.success("Product removed from wishlist");
      } else {
        await wishListServices.addToWishlist(userId, product._id, token);
        setWishlistItems((prev) => [...prev, product._id]);
        toast.success("Product added to wishlist");
      }
      fetchWishlistCount();
    } catch (error) {
      console.error("Wishlist error", error);
      toast.error("Error updating wishlist");
    }
  };
  const handleQuickView = (product, event) => {
    event.preventDefault(); // Prevent navigation issues
    setSelectedProduct(product);
    setShowModal(true);
  };


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (product && product._id) {
          // Ensure product and _id are available
          const res = await ReviewServices.getReviewsByProductId(product._id);
          setReviews(res?.data || []);
          console.log("review Data", res.data);
        }
      } catch (error) {
        console.error("Error fetching reviews", error);
      }
    };

    fetchReviews();
  }, [product]); // Dependency on the entire product object

  if (loading)
    return (
      <div className="container py-5 text-center">
        Loading product details...
      </div>
    );
  if (error)
    return (
      <div className="container py-5 text-center text-danger">
        Error: {error}
      </div>
    );
  if (!product)
    return <div className="container py-5 text-center">Product not found</div>;

  const currentPrice = selectedPrices[product._id] ?? product.price;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = relatedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(relatedProducts.length / itemsPerPage);
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
      handleImageClick(selectedProduct?._id, newIndex); // sync main image
    },
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };


  const handleImageClick = (productId, index) => {
    setModalImageIndex((prev) => ({
      ...prev,
      [productId]: index,
    }));
    setCurrentSlide(index);
  };



  // Function definition
  const getAverageRatingByProductId = (reviews, productId) => {
    const filtered = reviews.filter(
      (r) => r.productId === productId && r.status === "Active"
    );

    if (filtered.length === 0) return null;

    const total = filtered.reduce((sum, r) => sum + (r.rating || 0), 0);
    return (total / filtered.length).toFixed(1); // returns string like "4.5"
  };
  const rating = getAverageRatingByProductId(reviews, product._id);
  // console.log("Product ID:", product._id); 
  // console.log('rating',rating)

  return (
    <>
      <HomeHeader />
      <div className="container-fluid py-5">
        <div className="row justify-content bg-white">
          <div className="container mt-5 product-detail-container">
            <div className="row">
              {/* Product Image + Thumbnails */}
              <div className="col-lg-5">
                <div className="position-relative" style={{ height: '700px', width: '100%' }}>
                  <img
                    src={product.images[activeImageIndex]}
                    alt={product.name}
                    className="img-fluid main-image rounded-4 "
                    onError={handleImageError}
                    style={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'contain',
                    }}
                  />
                  <div className="d-flex mt-3 overflow-auto thumb-container">
                    {product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className={`thumbnail-img mx-2 ${activeImageIndex === index ? 'active-thumb' : ''}`}
                        onClick={() => setActiveImageIndex(index)}
                        style={{ height: '100%' }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="col-lg-7">
                <div className="product-info-card p-4 rounded-4 shadow-sm">
                  <h2 className="fw-bold">{product.name.toUpperCase()}</h2>
                  <p className="text-muted fs-5">{product.Sortdescription}</p>

                  <div className="price-section my-3">
                    <span className="text-muted text-decoration-line-through me-2">
                      {currency.symbol}{product.Originalprice}
                    </span>
                    <span className="text-danger fs-4 fw-bold">
                      {currency.symbol}{currentPrice}
                    </span>
                  </div>

                  {rating && (
                    <div className="mb-2 text-warning fw-bold">⭐ {rating} / 5</div>
                  )}

                  {/* Size Buttons */}
                  <div className="mt-4">
                    <strong>Size:</strong>
                    <div className="mt-2">
                      {product.productkey?.length > 0 ? (
                        product.productkey.map((item, index) => (
                          <button
                            key={item.Size}
                            className="me-1 "
                            onClick={() => onSizeClick(product, item.Size)}
                            style={{
                              border: '2px solid',
                              borderColor:
                                selectedSizes[product._id] === item.Size ? 'rgb(242, 6, 112)' : 'rgb(132, 131, 131)',

                            }}
                          >
                            {item.Size.toUpperCase()}
                          </button>

                        ))
                      ) : (
                        <p className="text-muted">No sizes available</p>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="d-flex align-items-center mt-4">
                    <div className="quantity-box me-3" >
                      <button className="btn btn-outline-dark" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                      <span>{quantity}</span>
                      <button className="btn btn-outline-dark" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button
                      className="btn btn-primary rounded-pill px-4"
                      onClick={() => handleAddToCart(product, selectedSizes[product._id])}
                    >
                      + Add to Cart
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="mt-4">
                    <div className="btn-group" role="group">
                      <button
                        className={`btn tab-btn ${activeTab === "details" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("details")}
                      >
                        Details
                      </button>
                      <button
                        className={`btn tab-btn ${activeTab === "data" ? "active-tab" : ""}`}
                        onClick={() => setActiveTab("data")}
                      >
                        Data Information
                      </button>
                    </div>

                    <div className="tab-content-box mt-3">
                      {activeTab === "details" && (
                        <div>
                          <h5 className="fw-semibold mb-2">Details</h5>
                          <p>{product.description}</p>
                        </div>
                      )}
                      {activeTab === "data" && (
                        <div>
                          <h5 className="fw-semibold mb-2">Data Information</h5>
                          <p>{product.Sortdescription}</p>
                          <p>Return: {product.refundPolicies?.returnable ? `${product.refundPolicies.returnWindow} Days` : "No Refund Policy"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div></div></div></div>

          <div className="text-center" style={{ paddingTop: '160px' }}>
            <h2 className="fw-bold">Customer Reviews</h2>
            <p className="text-muted">
              What our customers say about this product
            </p>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="row">
              {reviews.map((review, index) => (
                <div key={index} className="col-md-4 col-sm-4 mb-4">
                  <div
                    className="p-4 rounded-4 shadow-sm h-100"
                    style={{
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderLeft: "6px solid #ffc107",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-warning text-white fw-bold d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            fontSize: "18px",
                          }}
                        >
                          {review.username?.[0]?.toUpperCase() || "A"}
                        </div>
                        <h5 className="mb-0">
                          {review.username || "Anonymous"}
                        </h5>
                      </div>

                      <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`fa-star fa-lg mx-1 ${review.rating >= star
                              ? "fas text-warning"
                              : "far text-muted"
                              }`}
                            style={{ transition: "0.3s" }}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-dark mb-3">{review.description}</p>
                    {Array.isArray(review.images) &&
                      review.images.length > 0 ? (
                      <div className="d-flex flex-wrap gap-3 mt-3">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                            alt={`Review ${idx}`}
                            className="img-thumbnail"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      review.images && (
                        <div className="mt-3">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${review.images}`}
                            alt="Review"
                            className="img-fluid rounded shadow"
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted text-center">No reviews yet.</div>
          )}

          {/* Related Products */}
          <div className="text-center mt-5">
            <h2 className="fw-bold ">Related Products</h2>
            <p className="mt-3">Browse the collection of top products</p>
          </div>

          <div className="row px-5 py-3 mt-4">
            {currentItems.length > 0 ? (
              currentItems.map((related) => (
                <div
                  key={related._id}
                  className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content ml-4"
                >
                  <div className="ec-product-inner rounded">
                    <div className="ec-pro-image">
                      <img
                        className="main-image"
                        src={
                          related.images?.[0]
                            ? `${process.env.REACT_APP_API_BASE_URL}/${related.images[0]}`
                            : "/default-product.jpg"
                        }
                        alt={related.name}
                      //  style={{ width: "300px", height: "400px", objectFit: "cover" }} 
                      />
                      <div className="ec-pro-actions">
                        <button
                          title="Add To Cart"
                          className="add-to-cart"
                          onClick={() =>
                            handleAddToCart(related, selectedSizes[related._id])
                          }
                        >
                          <BsBasket3
                            style={{ fontSize: "12px", color: "black" }}
                          />
                        </button>
                        <button
                          onClick={(event) => handleQuickView(related, event)}
                          className="ec-btn-group quickview"
                        >
                          <FaRegEye />
                        </button>
                        <button
                          className="ec-btn-group wishlist"
                          title="Add to Wishlist"
                          onClick={() => handleAddToWishlist(related)}
                        >
                          {wishlistItems.includes(related._id) ? (
                            <FaHeart style={{ color: "red" }} />
                          ) : (
                            <FaRegHeart style={{ color: "black" }} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="ec-pro-content">
                        <h5 className="ec-pro-title">
                          <Link to={`/product-details/${related._id}`}>
                            {related.name.toUpperCase()}
                          </Link>
                        </h5>
                        <span className="ec-price">
                          <span
                            className="old-price"
                            style={{
                              textDecoration: "line-through",
                              color: "gray",
                            }}
                          >
                            {currency.symbol}
                            {related.originalPrice || related.Originalprice}
                          </span>
                          <span className="new-price ">
                            {currency.symbol}
                            {(() => {
                              const selectedSize = selectedSizes[related._id];
                              const sizeObj = related.productkey?.find(
                                (item) => item.Size === selectedSize
                              );
                              if (sizeObj && sizeObj.OfferPrice > 0) {
                                return related.price - sizeObj.OfferPrice;
                              }
                              return (
                                selectedPrices[related._id] || related.price
                              );
                            })()}
                          </span>
                        </span>
                      </div>

                      {related.productkey?.length > 0 && (
                        <div className="sizes mt-2">
                          Size:
                          <br />
                          {related.productkey.map((item) => (
                            <button
                              key={item.Size}
                              className="m-1 " style={{
                                border: '1px solid',
                                borderColor:
                                  selectedSizes[related._id] === item.Size ? 'rgb(242, 6, 112)' : 'rgb(132, 131, 131)',
                              }}
                              onClick={() => onSizeClick(related, item.Size)}
                            >
                              {item.Size}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-12">
                <p>No related products found.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {relatedProducts.length > itemsPerPage && (
            <div className="text-center my-4">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn mx-1 ${currentPage === i + 1 ? "btn-dark" : "btn-outline-dark"
                    }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        backdropClassName="modal-backdrop show"
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "white" }}
        ></Modal.Header>
        <Modal.Body style={{ backgroundColor: "white" }}>
          <div className="row">
            {/* Left Side - Product Images */}
            <div className="col-md-5" style={{ height: '460px' }}>
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedProduct?.images?.[
                  modalImageIndex[selectedProduct?._id]
                ]
                  }`}
                alt={selectedProduct?.name}
                className="w-100 mb-2"
                style={{ borderRadius: "10px", height: "79%", width: "100%" }}
              />

              <Slider {...sliderSettings}>
                {selectedProduct?.images?.map((img, index) => (
                  <div key={index} className="image-wrapper">
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className={`img-thumbnail mx-1 ${modalImageIndex[selectedProduct?._id] === index
                        ? "border border-dark"
                        : ""
                        }`}
                      style={{
                        width: "70px",
                        height: "90px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleImageClick(selectedProduct?._id, index)
                      }
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Right Side - Product Details */}
            <div className="col-md-4 mt-4">
              <Link to={`/product-details/${selectedProduct?._id}`}>
                <h5 className="text-danger fw-bold" style={{ fontSize: '30px' }}>{selectedProduct?.name?.toUpperCase()}</h5>
              </Link>
              <h5 className="mt-2">
                {selectedProduct?.Sortdescription}
              </h5>
              <div className="d-flex align-items-center mt-3">
                <span className="text-muted text-decoration-line-through me-2">
                  {currency.symbol}
                  {selectedProduct?.Originalprice}
                </span>
                <span className="fs-4 fw-bold text-dark">
                  {currency.symbol}
                  {selectedPrices[selectedProduct?._id] ||
                    selectedProduct?.price}
                </span>
              </div>

              {/* Size Selection */}
              <div className="mt-3">
                <h6>Select Size:</h6>
                {selectedProduct?.productkey?.length > 0 ? (
                  selectedProduct.productkey.map((size) => (
                    <button
                      key={size.Size}
                      className=" m-1 " style={{
                        border: '2px solid',
                        borderColor:
                          selectedSizes[selectedProduct._id] === size.Size ? 'rgb(242, 6, 112)' : 'rgb(132, 131, 131)',
                      }}
                      onClick={() => onSizeClick(selectedProduct, size.Size)} // Passing product object and size
                    >
                      {size.Size}
                    </button>
                  ))
                ) : (
                  <p>No sizes available</p> // Optional message if no sizes are available
                )}
              </div>

              {/* Quantity Selection */}
              <div
                className="mt-3 d-flex align-items-center"
                style={{ border: "1px solid black", width: '62%' }}
              >
                <button
                  className="btn btn-outline-dark "
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="mx-4">{quantity}</span>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                className="btn btn-dark mt-4 w-95"
                onClick={() =>
                  handleAddToCart(
                    selectedProduct,
                    selectedSizes[selectedProduct?._id]
                  )
                }
              >
                + Add to Cart
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Service />
      <Footer />
    </>
  );
};

export default ProductDetails;
