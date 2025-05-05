import React, { useEffect, useState } from "react";
import productServices from "../../services/productServices"; // Adjust path as needed
import { Link } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import Service from "../Service/Service";
import Slider from "react-slick";
import { useCurrency } from "../CurrencyContent";
import { FaRegHeart, FaRegEye, FaHeart } from "react-icons/fa";
import { BsBasket3 } from "react-icons/bs";
import wishListServices from "../../services/wishListServices";
import AddtoCartServices from "../../services/AddtoCart";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
const AllNewArrivals = () => {
  const [priceRange, setPriceRange] = useState({ min: 100, max: 7285 });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrices, setSelectedPrices] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [SelectedSizes, SetSelectedSizes] = useState([]);
  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem("wishlistItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [sortOption, setSortOption] = useState("price");
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
    const fetchRecentProducts = async () => {
      try {
        const res = await productServices.getproduct();
        const allProducts = res.data;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentProducts = allProducts.filter((product) => {
          const createdAt = new Date(product.createdAt);
          return createdAt >= sevenDaysAgo;
        });

        setProducts(recentProducts);
      } catch (err) {
        console.error("Error fetching recent products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
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
  const handleSizeChange = (size) => {
    SetSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };
  const productSizes = ["XS", "S", "M", "L", "XL", "XXL"]; // You can fetch this dynamically
  const itemsPerRow = 1; // Change to 3 for 3 per row, etc.

  const sizeRows = [];
  for (let i = 0; i < productSizes.length; i += itemsPerRow) {
    sizeRows.push(productSizes.slice(i, i + itemsPerRow));
  }
  const clearFilters = () => {
    setSelectedSizes({});
    SetSelectedSizes([]);
    setSearchTerm("");
    setPriceRange({ min: 100, max: 7285 });
  };

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Check if size matches any of selected sizes
    const sizeMatch =
      SelectedSizes.length === 0 ||
      product.productkey?.some((key) => SelectedSizes.includes(key.Size));

    // Check price range (use min available price from productkey)
    const productPrices = product.productkey?.map((key) =>
      key.OfferPrice > 0 ? product.price - key.OfferPrice : product.price
    );
    const minProductPrice =
      productPrices?.length > 0 ? Math.min(...productPrices) : product.price;
    const maxProductPrice =
      productPrices?.length > 0 ? Math.max(...productPrices) : product.price;

    const priceMatch =
      minProductPrice <= priceRange.max && maxProductPrice >= priceRange.min;

    return nameMatch && sizeMatch && priceMatch;
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceLowToHigh":
        return a.price - b.price;

      case "priceHighToLow":
        return b.price - a.price;

      case "name":
        return a.name.localeCompare(b.name); // A-Z

      case "nameDesc":
        return b.name.localeCompare(a.name); // Z-A

      case "bestSelling":
        return b.sold - a.sold; // Highest sold first

      case "newArrivals":
        return new Date(b.createdAt) - new Date(a.createdAt); // Latest first

      case "dateOldToNew":
        return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first

      case "dateNewToOld":
        return new Date(b.createdAt) - new Date(a.createdAt); // Newest first

      default:
        return 0;
    }
  });
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      <HomeHeader />
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            flex: 3,
            padding: "10px",
            marginLeft: "20px",
            marginTop: "1%",
          }}
        >
          <div
            style={{
              backgroundColor: "#FDFAF6",
              height: "50px",
              outline: "0.5px solid #000",
              display: "flex",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                marginLeft: "15px",
                marginBottom: "0",
              }}
            >
              Filter Products By
            </p>
          </div>

          <div
            style={{
              padding: "15px",
              outline: "0.5px solid #000",
              marginTop: "10px",
              backgroundColor: "#F6F0F0",
            }}
          >
            <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>Size:</h6>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "15px",
              }}
            >
              {sizeRows.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex" }}>
                  {row.map((size) => (
                    <label
                      key={size}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="checkbox"
                        style={{ marginRight: "5px" }}
                        checked={SelectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                      />
                      {size}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <hr style={{ outline: "0.5px solid #000" }} />

            <h6 className="mt-4">Price</h6>
            <div
              className="mt-4"
              style={{
                backgroundColor: "#FDFAF6",
                padding: "15px",
                borderRadius: "5px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                type="number"
                className="form-control form-control-sm"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: parseFloat(e.target.value),
                  })
                }
                placeholder="Min Price"
              />
              <input
                type="number"
                className="form-control form-control-sm"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: parseFloat(e.target.value),
                  })
                }
                placeholder="Max Price"
              />
            </div>

            <input
              type="range"
              className="form-range"
              min="100"
              max="12099"
              step="1"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({
                  ...priceRange,
                  max: parseFloat(e.target.value),
                })
              }
            />
            <small className="text-muted">Drag to adjust max price</small>
          </div>

          <div class="ec-sidebar-block-item">
            <button
              onClick={clearFilters}
              className="btn btn-primary w-100 mt-3"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div style={{ flex: 9, padding: "10px" }}>
          <section>
            {/* Sort By and Filter Section */}
            <div
              style={{
                flex: 6,
                padding: "10px",
                marginLeft: "20px",
                marginTop: "1%",
                backgroundColor: " #FDFAF6",
              }}
            >
              <button
                className="btn mt-2"
                style={{ backgroundColor: "#FF0B55" }}
              >
                <img src="img/dashboard.svg" alt="image" />
              </button>

              <div
                style={{
                  display: "inline-flex",
                  alignitems: "center",
                  float: "right",
                }}
              >
                <span className="mt-2">Sort By</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{
                    marginLeft: "12px",
                    padding: "5px",
                    border: "1px solid black",
                    outline: "1px solid #000",
                    paddingInlineEnd: "50px",
                  }}
                  className="form-select"
                >
                  <option value="default">Sort By</option>
                  <option value="priceLowToHigh">Price Low to High</option>
                  <option value="priceHighToLow">Price High to Low</option>
                  <option value="name">Alphabetical (A-Z)</option>
                  <option value="nameDesc">Alphabetical (Z-A)</option>
                  <option value="bestSelling">Best Selling</option>
                  <option value="newArrivals">New Arrivals</option>
                  <option value="dateOldToNew">Date: Old to New</option>
                  <option value="dateNewToOld">Date: New to Old</option>
                </select>
              </div>
            </div>

            <div className="container">
              <h2 className="mb-4 text-center fw-bold mt-2">🆕 New Arrivals</h2>

              {loading ? (
                <div className="text-center ">
                  <div className="spinner-border text-primary " role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : products.length > 0 ? (
                <div className="row g-4 ">
                  {currentProducts.map((product) => (
                    <div
                      key={product._id}
                      className="col-lg-3 col-md-6 col-sm-6 col-xs-6 ec-product-content ml-4 mt-4"
                    >
                      <div className="card h-100 shadow-sm border-0  ec-product-inner ">
                        <div className="ec-pro-image">
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${
                              product.images?.[0] || "default.jpg"
                            }`}
                            alt={product.name}
                            className="main-image"
                            style={{
                              height: "400px",
                              objectFit: "cover",
                              borderRadius: "10px 10px 0 0",
                            }}
                          />
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
                              onClick={(event) =>
                                handleQuickView(product, event)
                              }
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
                              onClick={() =>
                                onSizeClick(product._id, item.Size)
                              }
                            >
                              {item.Size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No recent arrivals available</p>
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
                    style={{
                      borderRadius: "10px",
                      height: "80%",
                      width: "100%",
                    }} // Fixed width typo
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
                        onClick={() =>
                          onSizeClick(selectedProduct._id, size.Size)
                        }
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
        </div>
      </div>
      <Service />
      <Footer />
    </>
  );
};

export default AllNewArrivals;
