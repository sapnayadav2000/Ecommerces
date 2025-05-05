import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import AddtoCartServices from "../../services/AddtoCart";
import { useCurrency } from "../CurrencyContent";
import { toast } from "react-toastify";

const AddToCart = () => {
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharges = 80;
  const couponDiscount = 0;
  const totalAmount = subTotal + deliveryCharges - couponDiscount;

  useEffect(() => {
    // Redirect to login if user is not found
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AddtoCartServices.getAllCart();
        const cartArray = response.data;
        if (Array.isArray(cartArray) && cartArray.length > 0) {
          setCart(cartArray[0]);
        } else {
          setCart(null);
        }
      } catch (error) {
        console.error("Failed to fetch cart", error);
      }
    };

    fetchProducts();
  }, []);

  const handleRemove = async (cartId, itemId) => {
    try {
      await AddtoCartServices.removeFromCartItem(cartId, itemId);
      toast.success("Item removed from cart");
      const response = await AddtoCartServices.getAllCart();
      const cartArray = response.data;
      if (Array.isArray(cartArray) && cartArray.length > 0) {
        setCart(cartArray[0]);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Failed to remove item", err);
      toast.err("Failed to remove item");
    }
  };

  const handleMove = () => {
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
    if (newQuantity < 1) return; // Prevent negative quantities

    try {
      console.log(
        `Updating quantity for cart ${cartId}, item ${itemId} to ${newQuantity}`
      );

      const response = await AddtoCartServices.updateQuantity(
        cartId,
        itemId,
        newQuantity
      );
      console.log("Update Response:", response); // Log the response

      const responses = await AddtoCartServices.getAllCart();
      const cartArray = responses.data;
      if (Array.isArray(cartArray) && cartArray.length > 0) {
        setCart(cartArray[0]);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Failed to update quantity", err);
      toast.error("Failed to update quantity");
    }
  };

  return (
    <>
      <HomeHeader />
      <section className="ec-page-content section-space-p">
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
                                          alt={
                                            item?.productId?.name ||
                                            "Product image"
                                          }
                                        />
                                        {item?.productId?.name ||
                                          "Unnamed Product"}
                                      </span>
                                    </td>
                                    <td>
                                      {item?.selectedSize && (
                                        <div>
                                          <small>
                                            Size: {item.selectedSize}
                                          </small>
                                        </div>
                                      )}
                                    </td>
                                    <td className="ec-cart-pro-price">
                                      <span className="amount">
                                        {currency.symbol}
                                        {item?.price?.toFixed(2) || "0.00"}
                                      </span>
                                    </td>
                                    <td
                                      className="ec-cart-pro-qty"
                                      style={{ textAlign: "center" }}
                                    >
                                      <div className="cart-qty-plus-minus">
                                        <button
                                          className="btn btn-sm btn-light"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleQuantityChange(
                                              cart._id,
                                              item._id,
                                              item.quantity - 1
                                            );
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
                                          onClick={(e) => {
                                            e.preventDefault(); // 👈 prevents default behavior (like changing the URL)
                                            handleQuantityChange(
                                              cart._id,
                                              item._id,
                                              item.quantity + 1
                                            );
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
                                        className="btn btn-primary"
                                        onClick={() =>
                                          handleRemove(cart._id, item._id)
                                        }
                                      >
                                        Remove
                                      </button>
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
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                if (!user) {
                                  navigate("/login");
                                } else {
                                  handleMove();
                                }
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
