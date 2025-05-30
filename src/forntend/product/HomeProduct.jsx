import React, { useEffect, useState } from "react";
import { FaRegHeart, FaRegEye, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsBasket3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import Productservices from "../../services/productServices";
import { Modal, Button } from "react-bootstrap";
import { useCurrency } from "../CurrencyContent";
import AddtoCartServices from "../../services/AddtoCart";
import wishListServices from "../../services/wishListServices";
import Slider from "react-slick";
import { useWishlist } from "../../Store/whislist";
import { useCart } from "../../Store/addtoCart";
const HomeProduct = () => {
  const { currency } = useCurrency();
  const {
    wishlistItems,
    setWishlistItems,
    fetchWishlistCount,
  } = useWishlist();



  const { fetchCartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState({});
  // const [wishlistItems, setWishlistItems] = useState(() => {
  //   const stored = localStorage.getItem("wishlistItems");
  //   return stored ? JSON.parse(stored) : [];
  // });
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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow:
      selectedProduct && selectedProduct.images?.length >= 4
        ? 4
        : selectedProduct?.images?.length || 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => {
      setActiveImageIndex((prev) => ({
        ...prev,
        [selectedProduct._id]: newIndex,
      }));
    },
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Productservices.getproduct();
        const activeProducts = response.data.filter(product => product.status === 'Active');
        setProducts(activeProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  const handleQuickView = (product, event) => {
    event.preventDefault(); // Prevent navigation issues
    setSelectedProduct(product);
    setShowModal(true);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page function
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const handleAddToCart = async (product, selectedSize = null) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    // Generate or get existing sessionId for guest user
    if (!localStorage.getItem("sessionId")) {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem("sessionId", newSessionId);
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
      toast.error("This product is already in your cart");
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

      fetchWishlistCount(); // update count
    } catch (error) {
      console.error("Wishlist error", error);
      toast.error("Error updating wishlist");
    }
  };

  return (
    <section className="section ec-trend-product section-space-p mt-4">
      <div className="container">
        <div className="row">
          <div
            className="ec-trend-sale"
            style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
          >
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content"
                  key={product._id}
                >
                  <div className="ec-pro-image-outer">
                    <div className="ec-product-inner">
                      <div className="ec-pro-image">
                        <Link
                          to={`/product-details/${product._id}`}
                          className="image"
                        >
                          <img
                            className="main-image"
                            src={`${process.env.REACT_APP_API_BASE_URL}/${product.images[0]}`}
                            alt={product.name}
                          />
                        </Link>
                        <div className="ec-pro-actions">
                          {/* Add to Cart Button */}

                          <button
                            title="Add To Cart"
                            className="add-to-cart"
                            onClick={() =>
                              handleAddToCart(
                                product,
                                selectedSizes[product._id]
                              )
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

                          {/* Wishlist Button */}
                          {/* <button
                            className="ec-btn-group wishlist"
                            title="Add to Wishlist"
                            onClick={() => handleAddToWishlist(product)}
                          >
                            <FaRegHeart />
                          </button> */}
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
                      <div className="ec-pro-content">
                        <h5 className="ec-pro-title">
                          <Link to={`/product-details/${product._id}`}>
                            {product.name.toUpperCase()}
                          </Link>
                        </h5>
                        <span className="ec-price">
                          <span
                            className="old-price"
                            style={{
                              textDecoration: "line-through",
                              color: "#777",
                            }}
                          >
                            {currency.symbol}
                            {product.originalPrice || product.Originalprice}
                          </span>

                          <span className="new-price ">
                            {currency.symbol}
                            {selectedPrices[product._id] || product.price}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Size Selection Buttons */}

                    {product.productkey?.map((item) => (
                      <button
                        key={item.Size}
                        className="m-1" style={{
                          border: '1px solid',
                          borderColor:
                            selectedSizes[product._id] === item.Size ? 'rgb(242, 6, 112)' : 'rgb(132, 131, 131)',
                        }}
                        onClick={() => onSizeClick(product._id, item.Size)}
                      >
                        {item.Size}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div>No products found.</div>
            )}
          </div>

          {/* Pagination */}
          <div className="custom-pagination-container mt-4">
            <div className="custom-pagination-info">

            </div>
            <ul className="custom-pagination">
              <li>
                <button
                  className="pagination-button"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  ⬅ Prev
                </button>
              </li>

              {Array.from({
                length: Math.min(5, Math.ceil(products.length / productsPerPage)),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    className={`pagination-number ${currentPage === index + 1 ? "active" : ""
                      }`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              {Math.ceil(products.length / productsPerPage) > 5 && (
                <li>
                  <button className="pagination-button" onClick={nextPage}>
                    Next ➡
                  </button>
                </li>
              )}

              <li>
                <button
                  className="pagination-button"
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(products.length / productsPerPage)}
                >
                  Next ➡
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
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
              {/* Main Image */}
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedProduct?.images?.[
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
                      src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className={`img-thumbnail mx-1 ${activeImageIndex[selectedProduct?._id] === index
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
                <h5 className="text-danger fw-bold" style={{ fontSize: '30px' }}>  {selectedProduct?.name?.toUpperCase()}</h5>
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
                    className="m-1 " style={{
                      border: '1px solid',
                      borderColor:
                        selectedSizes[selectedProduct._id] === size.Size ? 'rgb(242, 6, 112)' : 'rgb(132, 131, 131)',
                    }}
                    onClick={() => onSizeClick(selectedProduct._id, size.Size)}
                  >
                    {size.Size}
                  </button>
                ))}
              </div>

              {/* Quantity Selection */}
              <div
                className="mt-3 d-flex align-items-center"
                style={{ border: "1px solid black", width: '62%' }}
              >
                <button
                  className="btn btn-outline-dark"
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
    </section>
  );
};

export default HomeProduct;
