import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import wishListServices from "../../services/wishListServices";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { useCurrency } from "../CurrencyContent";
import { FaRegEye } from "react-icons/fa";
import { BsBasket3 } from "react-icons/bs";
import AddtoCartServices from "../../services/AddtoCart";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const AllWishlists = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedPrices, setSelectedPrices] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const getImageUrl = (img) => {
    if (!img) return "/admin/images/default-product.jpg";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `${process.env.REACT_APP_API_BASE_URL}/${img}`;
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token") || user?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAllWishlists = async () => {
      try {
        const response = await wishListServices.getAllWishList(token);

        if (response?.data?.products) {
          setWishlists([response.data]); // Wrap the response in an array
        } else {
          console.error(
            "Wishlist does not have 'products' field:",
            response?.data
          );
          setWishlists([]); // Set an empty array as fallback
        }
      } catch (err) {
        console.error("Error fetching all wishlists:", err);
        if (err?.response?.data?.message === "Please login again") {
          toast.error("Your session has expired. Please log in again.");
          navigate("/login");
        }
        setWishlists([]); // Fallback if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchAllWishlists();
  }, [navigate]);

  const removeWishlist = async (userId, productId) => {
    const token = localStorage.getItem("token");
    try {
      await wishListServices.removeFromWishlist(userId, productId, token);
      toast.success("Wishlist Removed");
      const response = await wishListServices.getAllWishList();
      if (response?.data?.products) {
        setWishlists([response.data]);
      } else {
        setWishlists([]);
      }
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  const onSizeClick = (product, size) => {
    const selectedSizeObj = product.productkey?.find(
      (item) => item.Size === size
    );
    if (!selectedSizeObj) return;

    const finalPrice =
      selectedSizeObj.OfferPrice > 0
        ? product.price - selectedSizeObj.OfferPrice
        : product.price;

    setSelectedPrices((prev) => ({
      ...prev,
      [product._id]: finalPrice,
    }));

    setSelectedSizes((prev) => ({
      ...prev,
      [product._id]: size,
    }));
  };

  const handleAddToCart = async (product, selectedSize = null) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;
    if (!userId) return toast.error("Please log in to add to cart.");
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const selectedPrice = selectedPrices[product._id] || product.price;

    const body = {
      userId: userId,
      productId: product._id,
      quantity:  quantity,
      selectedSize: selectedSize,
      price: selectedPrice,
    };

    try {
      const response = await AddtoCartServices.addToCart(body, token);
      toast.success("Product is added to cart");
      console.log("Added to cart:", response);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const handleQuickView = (product, event) => {
    event.preventDefault();
    setSelectedProduct(product);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading wishlists...</p>
      </div>
    );
  }

  return (
    <>
      <HomeHeader />
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold">My Wishlist</h2>
        <div className="row justify-content-start">
          {wishlists.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            wishlists.map((wishlist, index) =>
              wishlist.products.map((item, i) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <div
                    key={`${index}-${i}`}
                    className="col-md-6 col-lg-4 col-xl-3 mb-4"
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="card shadow-sm position-relative h-100">
                      <button
                        onClick={() =>
                          removeWishlist(wishlist.userId._id, product._id)
                        }
                        className="btn btn-primary"
                      >
                        Remove
                      </button>

                      <div className="position-relative">
                        <img
                          src={getImageUrl(product?.images?.[0])}
                          alt={product.name}
                          className="card-img-top p-3"
                          style={{ objectFit: "contain", height: "300px" }}
                          onError={(e) => {
                            e.target.src = "/admin/images/default-product.jpg";
                          }}
                        />

                        {hoveredProduct === product._id && (
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              display: "flex",
                              gap: "10px",
                              zIndex: 2,
                              padding: "10px",
                              borderRadius: "8px",
                            }}
                          >
                            <button
                              title="Add To Cart"
                              style={{
                                border: "none",
                                background: "white",
                                borderRadius: "50%",
                                padding: "10px",
                              }}
                              onClick={() =>
                                handleAddToCart(
                                  product,
                                  selectedSizes[product._id]
                                )
                              }
                            >
                              <BsBasket3
                                style={{ fontSize: "16px", color: "black" }}
                              />
                            </button>
                            <button
                              title="Quick View"
                              style={{
                                border: "none",
                                background: "white",
                                borderRadius: "50%",
                                padding: "10px",
                              }}
                              onClick={(event) =>
                                handleQuickView(product, event)
                              }
                            >
                              <FaRegEye
                                style={{ fontSize: "16px", color: "black" }}
                              />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="card-body text-center">
                        <h6 className="card-title text-truncate">
                          <Link to={`/product-details/${product._id}`}>
                            {product.name}
                          </Link>
                        </h6>
                        <p className="mb-1">
                          <span className="text-muted text-decoration-line-through me-2">
                            {currency.symbol}
                            {Number(
                              product.originalPrice || product.price * 1.2
                            ).toFixed(2)}
                          </span>
                          <span className="fw-bold text-danger">
                            {currency.symbol}
                            {selectedPrices[product._id]
                              ? selectedPrices[product._id].toFixed(2)
                              : Number(product.price).toFixed(2)}
                          </span>
                        </p>

                        <div>
                          {product.productkey?.map((item) => (
                            <button
                              key={item.Size}
                              className={`btn btn-primary ml-3 ${
                                selectedSizes[product._id] === item.Size
                                  ? "btn-dark"
                                  : "btn-outline-primary"
                              }`}
                              onClick={() => onSizeClick(product, item.Size)}
                            >
                              {item.Size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      <Footer />

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
            <div className="col-md-5">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${selectedProduct?.images[0]}`}
                alt={selectedProduct?.name}
                className="w-100 mb-2"
                style={{ borderRadius: "10px", height: "80%" }}
              />
              <div className="d-flex">
                {selectedProduct?.images.map((img, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                    alt={`Thumbnail ${index}`}
                    className="img-thumbnail mx-1"
                    style={{ width: "60px", height: "60px", cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>

            <div className="col-md-3 mt-4">
              <h5>{selectedProduct?.name}</h5>
              <div className="d-flex align-items-center mt-3">
                <span className="text-muted text-decoration-line-through me-2">
                  {currency.symbol}
                  {selectedProduct?.originalPrice ||
                    (selectedProduct?.price * 1.2).toFixed(2)}
                </span>
                <span className="fs-4 fw-bold text-dark">
                  {currency.symbol}
                  {selectedPrices[selectedProduct?._id] ||
                    selectedProduct?.price}
                </span>
              </div>

              <div className="mt-3">
                <h6>Select Size:</h6>
                {selectedProduct?.productkey?.map((size) => (
                  <button
                    key={size.Size}
                    className="btn btn-primary m-1"
                    onClick={() => onSizeClick(selectedProduct, size.Size)}
                  >
                    {size.Size}
                  </button>
                ))}
              </div>

              <div
                className="mt-3 d-flex align-items-center"
                style={{ border: "1px solid black" }}
              >
                <button
                  className="btn btn-outline-dark"
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

export default AllWishlists;
