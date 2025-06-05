// import React, { useEffect, useState } from "react";
// import HomeHeader from "../HomeHeader";
// import Footer from "../Footer";
// import { useNavigate } from "react-router-dom";
// import AddtoCartServices from "../../services/AddtoCart";
// import { useCurrency } from "../CurrencyContent";
// import { toast } from "react-toastify";
// import { useCart } from "../../Store/addtoCart";

// const AddToCart = () => {
//   const { fetchCartCount } = useCart();
//   const [cart, setCart] = useState(null);
//   const [loadingItem, setLoadingItem] = useState(null);
//   const { currency } = useCurrency();
//   const navigate = useNavigate();
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);

//   const items = cart?.items || [];
//   const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const deliveryCharges = 80;
//   const couponDiscount = 0;
//   const totalAmount = subTotal + deliveryCharges - couponDiscount;

//   const fetchCart = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       let sessionId = localStorage.getItem("sessionId");
//       if (!sessionId) sessionId = crypto.randomUUID();
//       const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
//       const userId = tokenPayload?._id || tokenPayload?.id || null;
//       let response;

//       if (userId) {
//         await AddtoCartServices.mergeCartToUser(sessionId, userId);
//         response = await AddtoCartServices.getAllCart(userId);
//       } else {
//         response = await AddtoCartServices.getAllCart(null, sessionId);
//       }

//       const cartData = response?.data;
//       if (cartData?.items?.length) {
//         setCart(cartData);
//         fetchCartCount();
//       } else {
//         setCart(null);
//       }
//     } catch (error) {
//       console.error("Cart fetch error:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const handleRemove = async (cartId, itemId) => {
//     try {
//       await AddtoCartServices.removeFromCartItem(cartId, itemId);
//       toast.success("Item removed from cart");
//       await fetchCart();
//     } catch (err) {
//       toast.error("Failed to remove item");
//     }
//   };

//   const handleMove = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.warning("Please login to continue checkout");
//       navigate("/login");
//       return;
//     }

//     navigate("/order-details", {
//       state: {
//         cartId: cart?._id,
//         subTotal,
//         deliveryCharges: 0,
//         couponDiscount: 0,
//         totalAmount: subTotal,
//       },
//     });
//   };

//   const handleQuantityChange = async (cartId, itemId, newQuantity) => {
//     if (newQuantity < 1 || loadingItem === itemId) return;
//     setLoadingItem(itemId);
//     try {
//       await AddtoCartServices.updateQuantity(cartId, itemId, newQuantity);
//       await fetchCart();
//     } catch (err) {
//       toast.error("Failed to update quantity");
//     } finally {
//       setLoadingItem(null);
//     }
//   };

//   return (
//     <>
//       <HomeHeader />
//       <section className="ec-page-content section-space-p mt-5">
//         <div className="container">
//           <div className="row">
//             <div className="ec-cart-leftside col-lg-12 col-md-12">
//               <div className="ec-cart-content">
//                 <div className="ec-cart-inner">
//                   <form>
//                     <div className="table-content cart-table-content">
//                       <table>
//                         <thead>
//                           <tr>
//                             <th>Product</th>
//                             <th>Size</th>
//                             <th>Price</th>
//                             <th style={{ textAlign: "center" }}>Quantity</th>
//                             <th>Total</th>
//                             <th>Delete</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {items.length > 0 ? (
//                             items.map((item, index) => {
//                               const total = item.price * item.quantity;
//                               return (
//                                 <tr key={index}>
//                                   <td className="ec-cart-pro-name">
//                                     <span>
//                                       <img
//                                         className="ec-cart-pro-img mr-4"
//                                         src={
//                                           item?.productId?.images?.[0]
//                                             ? `${process.env.REACT_APP_API_BASE_URL}/${item.productId.images[0]}`
//                                             : "https://via.placeholder.com/50"
//                                         }
//                                         alt={item?.productId?.name || "Product"}
//                                       />
//                                       {item?.productId?.name}
//                                     </span>
//                                   </td>
//                                   <td>{item?.selectedSize && <small>Size: {item.selectedSize}</small>}</td>
//                                   <td>
//                                     {currency.symbol}
//                                     {item?.price?.toFixed(2)}
//                                   </td>
//                                   <td style={{ textAlign: "center" }}>
//                                     <div className="cart-qty-plus-minus">
//                                       <button
//                                         className="btn btn-sm btn-light"
//                                         onClick={(e) => {
//                                           e.preventDefault();
//                                           handleQuantityChange(cart._id, item._id, item.quantity - 1);
//                                         }}
//                                         disabled={loadingItem === item._id}
//                                       >
//                                         -
//                                       </button>
//                                       <input
//                                         className="cart-plus-minus"
//                                         type="text"
//                                         value={item.quantity}
//                                         readOnly
//                                       />
//                                       <button
//                                         className="btn btn-sm btn-light"
//                                         onClick={(e) => {
//                                           e.preventDefault();
//                                           handleQuantityChange(cart._id, item._id, item.quantity + 1);
//                                         }}
//                                         disabled={loadingItem === item._id}
//                                       >
//                                         +
//                                       </button>
//                                     </div>
//                                   </td>
//                                   <td>{currency.symbol}{total.toFixed(2)}</td>
//                                   <td>
//                                     <button
//                                       type="button"
//                                       className="btn fw-bold"
//                                       style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))' }}
//                                       onClick={() => {
//                                         setSelectedWishlistItem({ cartId: cart._id, productId: item._id });
//                                         setShowConfirmModal(true);
//                                       }}
//                                     >
//                                       Remove
//                                     </button>
//                                   </td>
//                                 </tr>
//                               );
//                             })
//                           ) : (
//                             <tr>
//                               <td colSpan="6" className="text-center">
//                                 🛒 Your cart is empty. <a href="/">Start Shopping</a>
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="row mt-3">
//                       <div className="col-lg-12 d-flex justify-content-between">
//                         <a href="/">Continue Shopping</a>
//                         <button
//                           className="btn fw-bold"
//                           style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))' }}
//                           onClick={(e) => {
//                             e.preventDefault();
//                             handleMove();
//                           }}
//                         >
//                           Check Out
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showConfirmModal && (
//           <div className="modal-backdrop d-flex justify-content-center align-items-center">
//             <div className="modal-content p-4 bg-white rounded shadow" style={{ width: "450px", textAlign: 'center', height: '150px' }}>
//               <h6 className="mb-2">Are you sure?</h6>
//               <p style={{ fontSize: "14px" }}>Do you want to remove this item from your cart?</p>
//               <div className="d-flex justify-content-end gap-2">
//                 <button className="btn btn-sm btn-secondary mt-2" onClick={() => setShowConfirmModal(false)}>
//                   Cancel
//                 </button>
//                 <button
//                   className="btn btn-sm btn-danger mt-2"
//                   onClick={() => {
//                     if (selectedWishlistItem) {
//                       handleRemove(selectedWishlistItem.cartId, selectedWishlistItem.productId);
//                     }
//                     setShowConfirmModal(false);
//                   }}
//                 >
//                   OK
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </section>
//       <Footer />
//     </>
//   );
// };

// export default AddToCart;


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
  const [loadingItem, setLoadingItem] = useState(null);
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWishlistItem, setSelectedWishlistItem] = useState(null);

  const items = cart?.items || [];
  const subTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharges = 80;
  const couponDiscount = 0;
  const totalAmount = subTotal + deliveryCharges - couponDiscount;

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("sessionId", sessionId);
      }

      const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = tokenPayload?._id || tokenPayload?.id || null;
      let response;

      if (userId) {
        const hasMerged = localStorage.getItem("hasMergedCart");
        if (!hasMerged) {
          await AddtoCartServices.mergeCartToUser(sessionId, userId);
          localStorage.setItem("hasMergedCart", "true");
        }
        response = await AddtoCartServices.getAllCart(userId);
      } else {
        response = await AddtoCartServices.getAllCart(null, sessionId);
        localStorage.removeItem("hasMergedCart");
      }

      const cartData = response?.data;
      if (cartData?.items?.length) {
        setCart(cartData);
        fetchCartCount();
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Cart fetch error:", error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartId, itemId) => {
    try {
      await AddtoCartServices.removeFromCartItem(cartId, itemId);
      toast.success("Item removed from cart");
      await fetchCart();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleMove = () => {
    const token = localStorage.getItem("token");
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
    if (newQuantity < 1 || loadingItem === itemId) return;
    setLoadingItem(itemId);
    try {
      await AddtoCartServices.updateQuantity(cartId, itemId, newQuantity);
      await fetchCart();
    } catch (err) {
      toast.error("Failed to update quantity");
    } finally {
      setLoadingItem(null);
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
                              const total = item.price * item.quantity;
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
                                        alt={item?.productId?.name || "Product"}
                                      />
                                      {item?.productId?.name}
                                    </span>
                                  </td>
                                  <td>{item?.selectedSize && <small>Size: {item.selectedSize}</small>}</td>
                                  <td>
                                    {currency.symbol}
                                    {item?.price?.toFixed(2)}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <div className="cart-qty-plus-minus d-flex align-items-center justify-content-center gap-1">
                                      <button
                                        className="btn btn-sm btn-light"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleQuantityChange(cart._id, item._id, item.quantity - 1);
                                        }}
                                        disabled={loadingItem === item._id}
                                      >
                                        -
                                      </button>
                                      <input
                                        className="cart-plus-minus text-center"
                                        type="text"
                                        value={item.quantity}
                                        readOnly
                                        style={{ width: "40px" }}
                                      />
                                      <button
                                        className="btn btn-sm btn-light"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleQuantityChange(cart._id, item._id, item.quantity + 1);
                                        }}
                                        disabled={loadingItem === item._id}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    {currency.symbol}
                                    {total.toFixed(2)}
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn fw-bold"
                                      style={{
                                        background: "linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))",
                                      }}
                                      onClick={() => {
                                        setSelectedWishlistItem({ cartId: cart._id, productId: item._id });
                                        setShowConfirmModal(true);
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                🛒 Your cart is empty. <a href="/">Start Shopping</a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="col-lg-12 d-flex justify-content-between">
                        <a href="/">Continue Shopping</a>
                        <button
                          className="btn fw-bold"
                          style={{ background: "linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))" }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleMove();
                          }}
                        >
                          Check Out
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showConfirmModal && (
          <div className="modal-backdrop d-flex justify-content-center align-items-center">
            <div
              className="modal-content p-4 bg-white rounded shadow"
              style={{ width: "450px", textAlign: "center", height: "150px" }}
            >
              <h6 className="mb-2">Are you sure?</h6>
              <p style={{ fontSize: "14px" }}>Do you want to remove this item from your cart?</p>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-sm btn-secondary mt-2" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-danger mt-2"
                  onClick={() => {
                    if (selectedWishlistItem) {
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
      </section>
      <Footer />
    </>
  );
};

export default AddToCart;
