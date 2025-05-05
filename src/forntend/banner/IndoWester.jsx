import React, { useEffect, useState } from "react";
import productServices from "../../services/productServices"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCurrency } from "../CurrencyContent";
import { FaRegHeart, FaRegEye, FaHeart } from "react-icons/fa";
import { BsBasket3 } from "react-icons/bs";
import wishListServices from "../../services/wishListServices";
import AddtoCartServices from "../../services/AddtoCart";
import { Modal, Button } from "react-bootstrap";
import Slider from "react-slick";
import { toast } from "react-toastify";
const IndoWestern = () => {
  const { currency } = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation on button click
  const [selectedPrices, setSelectedPrices] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem("wishlistItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState({
    [selectedProduct?._id]: 0, // Default to the first image of the selected product
  });
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  const handleImageClick = (productId, index) => {
    setActiveImageIndex((prevState) => ({
      ...prevState,
      [productId]: index, // Set active index for the specific product
    }));
  };
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setActiveImageIndex((prevState) => ({
        ...prevState,
        [selectedProduct?._id]: 0, // Reset to first image when selectedProduct changes
      }));
    }
  }, [selectedProduct]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productServices.getproduct();
        const allProducts = res.data;
        console.log('All Products', allProducts);
  
        const normalize = (str) => str.toLowerCase().replace(/\s+/g, ' ').trim();
  
        const Products = allProducts.filter((product) => {
          return product.subCategoryname?.some(
            (name) => normalize(name) === "indo western"
          );
        });
  
        console.log('Indo Western Products', Products);
        setProducts(Products);
      } catch (err) {
        console.error("Error fetching Indo Western products:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  
  
  
  const onSizeClick = (productId, size) => {
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const selectedSize = product.productkey?.find((item) => item.Size === size);
    if (!selectedSize) return;

    const finalPrice =
      selectedSize.OfferPrice > 0
        ? product.price - selectedSize.OfferPrice
        : product.price;

    setSelectedPrices((prev) => ({
      ...prev,
      [productId]: finalPrice,
    }));

    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
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
    } catch (error) {
      console.error("Wishlist error", error);
      toast.error("Error updating wishlist");
    }
  };
  const handleAddToCart = async (product, selectedSize = null) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    if (!userId) return toast.error("Please log in to add to cart.");
    if (!selectedSize) return toast.error("Please select a size.");
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const selectedPrice = selectedPrices[product._id] || product.price;

    const body = {
      userId: userId,
      productId: product._id,
      quantity: quantity,
      selectedSize: selectedSize,
      price: selectedPrice,
    };

    try {
      const response = await AddtoCartServices.addToCart(body, token);

      if (response?.status === 409) {
        // If the backend returns a 409 status, it means the product is already in the cart
        toast.error("This product is already in your cart.");
      } else {
        toast.success("Product added to cart successfully.");
      }

      console.log("Added to cart:", response);
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error("Product already in cart.");
    }
  };
  const handleQuickView = (product, event) => {
    event.preventDefault(); // Prevent navigation issues
    setSelectedProduct(product);
    setShowModal(true);
  };
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };
  return (
    <>
      <section className="ec-banner section py-5">
        <div className="container">
          <h2 className="mb-4 text-center fw-bold">Indo Western</h2>
          <div className="row g-4">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              products.slice(0, 4).map((product) => (
                <div
                  key={product._id}
                  className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content ml-4"
                >
                  <div className="card h-100 shadow-sm border-0 ec-product-inner">
                    <div className="ec-pro-image">
                      <img
                        className="main-image"
                        src={`${process.env.REACT_APP_API_BASE_URL}/${
                          product.images?.[0] || "default.jpg"
                        }`}
                        alt={product.name}
                        style={{
                          height: "350px",

                          objectFit: "cover",
                        }}
                      />
                      <div className="ec-pro-actions">
                        {/* Add to Cart Button */}

                        <button
                          title="Add To Cart"
                          className="add-to-cart"
                          onClick={() =>
                            handleAddToCart(product, selectedSizes[product._id])
                          }
                        >
                          <BsBasket3
                            style={{ fontSize: "12px", color: "black" }}
                          />
                        </button>

                        {/* Quick View Button (Open Modal) */}
                        <button
                          onClick={(event) => handleQuickView(product, event)}
                          className="ec-btn-group quickview"
                        >
                          <FaRegEye />
                        </button>

                        <button
                          className="ec-btn-group wishlist"
                          title="Add to Wishlist"
                          onClick={() => handleAddToWishlist(product)}
                        >
                          {wishlistItems.includes(product._id) ? (
                            <FaHeart style={{ color: "red" }} />
                          ) : (
                            <FaRegHeart style={{ color: "black" }} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="card-body ">
                      <h5 className="ec-pro-title">
                        <Link to={`/product-details/${product._id}`}>
                          {product.name}
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
                          {product.originalPrice || product.Originalprice}
                        </span>

                        <span className="new-price ml-3">
                          {currency.symbol}
                          {selectedPrices[product._id] || product.price}
                        </span>
                      </span>
                    </div>
                    <div>
                      {product.productkey?.map((item) => (
                        <button
                          key={item.Size}
                          className="btn btn-primary m-2"
                          onClick={() => onSizeClick(product._id, item.Size)}
                        >
                          {item.Size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No Indo Western available</p>
            )}
          </div>

          {/* Explore All Button */}
          {!loading && products.length > 4 && (
  <div className="text-center mt-4">
    <button
      className="btn btn-primary"
      onClick={() => navigate("/all-new-arrivals")}
    >
      Explore All
    </button>
  </div>
)}
        </div>
      </section>
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
            <div className="col-md-5">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${
                  selectedProduct?.images?.[
                    activeImageIndex[selectedProduct?._id]
                  ]
                }`} // Use active index for this product
                alt={selectedProduct?.name}
                className="w-100 mb-2"
                style={{ borderRadius: "10px", height: "80%", width: "100%" }} // Fixed width typo
              />

              {/* Thumbnails */}
              <Slider {...sliderSettings}>
                {selectedProduct?.images?.map((img, index) => (
                  <div key={index} className="image-wrapper">
                    <img
                      key={index}
                      src={`${process.env.REACT_APP_API_BASE_URL}/${img}`} // Actual image URL
                      alt={`Thumbnail ${index + 1}`}
                      className={`img-thumbnail mx-1 ${
                        activeImageIndex[selectedProduct?._id] === index
                          ? "border border-dark"
                          : ""
                      }`} // Add border if active
                      style={{
                        width: "70px",
                        height: "90px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleImageClick(selectedProduct?._id, index)
                      } // Update active image index for the specific product
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Right Side - Product Details */}
            <div className="col-md-3 mt-4">
              <Link to={`/product-details/${selectedProduct?._id}`}>
                <h5>{selectedProduct?.name}</h5>
              </Link>
              <h5 className="mt-2">{selectedProduct?.Sortdescription}</h5>
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
                {selectedProduct?.productkey?.map((size) => (
                  <button
                    key={size.Size}
                    className="btn btn-primary m-1 mt-4"
                    onClick={() => onSizeClick(selectedProduct._id, size.Size)}
                  >
                    {size.Size}
                  </button>
                ))}
              </div>

              {/* Quantity Selection */}
              <div
                className="mt-3 d-flex align-items-center"
                style={{ border: "1px solid black" }}
              >
                <button
                  className="btn btn-outline-dark "
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="mx-3">{quantity}</span>
                <button
                  className="btn btn-outline-dark"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                className="btn btn-dark mt-4 w-100"
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
    </>
  );
};

export default IndoWestern;
