
import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import AddtoCartServices from "../../services/AddtoCart";
import { useCurrency } from "../CurrencyContent";
import { toast } from "react-toastify";
import { useCart } from "../../Store/addtoCart";
const AddToCart = () => {
  const { fetchCartCount } = useCart();
  const [cart, setCart] = useState(null);
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);
  const items = cart?.items || [];
  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharges = 80;
  const couponDiscount = 0;
  const totalAmount = subTotal + deliveryCharges - couponDiscount;



  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      let sessionId = localStorage.getItem("sessionId");

      // Generate new session ID if not found
      if (!sessionId) {
        sessionId = crypto.randomUUID(); // or use uuidv4()

      }

      // Decode JWT to get userId
      const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = tokenPayload?._id || tokenPayload?.id || null;

      console.log("Session ID:", sessionId);
      console.log("User ID:", userId);

      let response;

      if (userId) {
        // Merge cart and then clear session ID
        const mergeResponse = await AddtoCartServices.mergeCartToUser(sessionId, userId);
        if (mergeResponse?.status) {
          console.log("Cart merged successfully");

          // ✅ Clear session cart reference to prevent future re-merges

        } else {
          console.log("No cart merge needed or failed");
        }

        response = await AddtoCartServices.getAllCart(userId);
      } else {
        // Not logged in: fetch session cart
        response = await AddtoCartServices.getAllCart(null, sessionId);
      }

      const cartData = response?.data;
      if (cartData && typeof cartData === "object" && cartData.items?.length) {
        setCart(cartData);
        fetchCartCount();
      } else {
        setCart(null);
      }

    } catch (error) {
      console.error("Failed to fetch or merge cart:", error.message || error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);




  // 
  const handleRemove = async (cartId, itemId) => {
    try {
      await AddtoCartServices.removeFromCartItem(cartId, itemId);

      toast.success("Item removed from cart");
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
      toast.error("Failed to remove item");
    }
  };


  const handleMove = () => {
    const token = localStorage.getItem("token"); // Adjust key if different
    if (!token) {
      toast.warning("Please login to continue checkout");
      navigate("/login");
      return;
    }

    navigate("/order-details", {
      state: {
        cartId: cart?._id,
        subTotal,
        deliveryCharges: 0,
        couponDiscount: 0,
        totalAmount: subTotal,
      },
    });
  };


  const handleQuantityChange = async (cartId, itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await AddtoCartServices.updateQuantity(cartId, itemId, newQuantity);
      toast.success("Quantity updated");
      await fetchCart(); // refresh cart after update
    } catch (err) {
      console.error("Failed to update quantity", err);
      toast.error("Failed to update quantity");
    }
  };

  return (
    <>
      <HomeHeader />
      <section className="ec-page-content section-space-p mt-5">
        <div className="container">
          <div className="row">
            <div className="ec-cart-leftside col-lg-12 col-md-12">
              <div className="ec-cart-content">
                <div className="ec-cart-inner">
                  <div className="row">
                    <form>
                      <div className="table-content cart-table-content">
                        <table>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Size</th>
                              <th>Price</th>
                              <th style={{ textAlign: "center" }}>Quantity</th>
                              <th>Total</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length > 0 ? (
                              items.map((item, index) => {
                                const total =
                                  item?.price && item?.quantity
                                    ? item.price * item.quantity
                                    : 0;
                                return (
                                  <tr key={index}>
                                    <td className="ec-cart-pro-name">
                                      <span>
                                        <img
                                          className="ec-cart-pro-img mr-4"
                                          src={
                                            item?.productId?.images?.[0]
                                              ? `${process.env.REACT_APP_API_BASE_URL}/${item.productId.images[0]}`
                                              : "https://via.placeholder.com/50"
                                          }
                                          alt={item?.productId?.name || "Product image"}
                                        />
                                        {item?.productId?.name || "Unnamed Product"}
                                      </span>
                                    </td>
                                    <td>
                                      {item?.selectedSize && (
                                        <div>
                                          <small>Size: {item.selectedSize}</small>
                                        </div>
                                      )}
                                    </td>
                                    <td className="ec-cart-pro-price">
                                      <span className="amount">
                                        {currency.symbol}
                                        {item?.price?.toFixed(2) || "0.00"}
                                      </span>
                                    </td>
                                    <td className="ec-cart-pro-qty" style={{ textAlign: "center" }}>
                                      <div className="cart-qty-plus-minus">
                                        <button
                                          className="btn btn-sm btn-light"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleQuantityChange(cart._id, item._id, item.quantity - 1);
                                          }}
                                        >
                                          -
                                        </button>
                                        <input
                                          className="cart-plus-minus"
                                          type="text"
                                          name="cartqtybutton"
                                          value={item?.quantity}
                                          readOnly
                                        />
                                        <button
                                          className="btn btn-sm btn-light"
                                          onClick={(e) => {
                                            e.preventDefault(); // 👈 prevents default behavior (like changing the URL)
                                            handleQuantityChange(cart._id, item._id, item.quantity + 1);
                                          }}
                                        >
                                          +
                                        </button>
                                      </div>
                                    </td>
                                    <td className="ec-cart-pro-subtotal">
                                      {currency.symbol}
                                      {total.toFixed(2)}
                                    </td>
                                    <td className="ec-cart-pro-remove">
                                      <button
                                        type="button"
                                        className="btn fw-bold " style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))' }}
                                        onClick={() => {
                                          // Set the item to be removed and show the confirmation modal
                                          setSelectedWishlistItem({ cartId: cart._id, productId: item._id });
                                          setShowConfirmModal(true);
                                        }}

                                      >
                                        Remove
                                      </button>
                                      {showConfirmModal && (
                                        <div
                                          className="modal-backdrop"
                                          style={{
                                            position: "fixed",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                                            zIndex: 1050,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            className="modal-content p-4 bg-white rounded shadow"
                                            style={{ width: "450px", textAlign: 'center',height:'150px' }} // Smaller modal width
                                          >
                                            <h6 className="mb-2">Are you sure?</h6>
                                            <p style={{ fontSize: "14px" }}>Do you want to remove this item from your cart?</p>
                                            <div className="d-flex justify-content-end gap-2">
                                              <button
                                                className="btn btn-sm btn-secondary mt-2"
                                                onClick={() => setShowConfirmModal(false)}
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                className="btn btn-sm btn-danger mt-2"
                                                onClick={() => {
                                                  if (selectedWishlistItem) {
                                                    // Call remove function when user confirms
                                                    handleRemove(selectedWishlistItem.cartId, selectedWishlistItem.productId);
                                                  }
                                                  setShowConfirmModal(false);
                                                }}
                                              >
                                                OK
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="6" style={{ textAlign: "center" }}>
                                  🛒 Your cart is empty.{" "}
                                  <a href="/">Start Shopping</a>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="ec-cart-update-bottom">
                            <a href="/">Continue Shopping</a>
                            <button
                              type="submit"
                              className="btn fw-bold " style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))',color:'black' }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMove();
                              }}
                            >
                              Check Out
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AddToCart;
