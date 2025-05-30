import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import AddtoCartServices from "../../services/AddtoCart";
import OrderServices from "../../services/orderServices";
import { useCurrency } from "../CurrencyContent";
import AddressServices from "../../services/adressServices"; // Import AddressServices
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pincodeservices from "../../services/pincode";
const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartId } = location.state || {};
  const { currency } = useCurrency();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    if (!cartId) {
      // toast.error("Cart ID not provided");
      navigate("/add-to-cart");
      return;
    }

    const fetchCartDetails = async () => {
      try {
        const res = await AddtoCartServices.getCartById(cartId);
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        toast.error("Failed to fetch cart details.");
        setLoading(false);
        return; // Stop if cart fetch fails
      }

      try {
        const addressRes = await AddressServices.getAddress();
        const fetchedAddresses = addressRes.data || [];
        setAddresses([...fetchedAddresses]);
        if (fetchedAddresses.length > 0) {
          setSelectedAddressIndex(0);
        }
      } catch (err) {
        console.warn("No address found or error fetching addresses:", err);
        // Do NOT show toast here unless you want to notify user
        // toast.info("No address found. Please add a shipping address.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, [cartId, navigate]);

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    const isEmpty = Object.entries(newAddress).some(
      ([key, val]) => key !== "country" && !val
    );
    if (isEmpty) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const addressToCreate = {
      ...newAddress,
      userId: user?._id, // ✅ Add the user ID here
    };
    try {
      const response = await AddressServices.createAddress(addressToCreate);
      console.log("address", response);
      if (response && response.data) {
        const updatedAddresses = [...addresses, response.data];
        setAddresses(updatedAddresses);
        setSelectedAddressIndex(updatedAddresses.length - 1);
        setNewAddress({
          firstName: "",
          lastName: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });
      } else {
        toast.error("Failed to add address.");
      }
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error("Error adding address.");
    }
  };

  const handlePaymentSubmit = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (selectedAddressIndex === null) {
      toast.error("Please select a shipping address.");
      return;
    }

    // ✅ Check agreement for COD
    if (selectedPayment === "COD" && !agreeTerms) {
      toast.error("Please agree to the Terms & Conditions before placing the order.");
      return;
    }

    const selectedShippingAddress = addresses[selectedAddressIndex];

    // ✅ Step: Check pincode via backend
    try {
      const pinRes = await Pincodeservices.checkPincode(
        selectedShippingAddress.pincode.trim()
      );

      console.log("pinRes", pinRes);

      if (!pinRes || typeof pinRes.status === "undefined") {
        toast.error("Invalid response structure from pincode check.");
        return;
      }

      if (pinRes.status === false) {
        toast.error(pinRes.message || "This pincode is not serviceable.");
        return;
      }

      if (pinRes.status === true) {
        console.log("Pincode is serviceable.");
      }
    } catch (err) {
      console.error("Pincode check failed:", err);
      toast.error("This pincode is not serviceable. Choose another one.");
      return;
    }

    // ✅ Continue placing order
    const txnId = `TXN_${Date.now()}`;
    const shippingDetails = `${selectedShippingAddress.address}, ${selectedShippingAddress.city}, ${selectedShippingAddress.state}, ${selectedShippingAddress.country}, ${selectedShippingAddress.pincode}`;

    const orderData = {
      txnId,
      cartId: cart._id,
      userId: cart.userId._id,
      userAddressId: selectedShippingAddress._id,
      totalProducts: cart.items.length,
      totalAmount: cart.totalPrice,
      gatewayAmount: cart.totalPrice,
      shippingAmount: 0,
      discountAmount: 0,
      grandTotal: cart.totalPrice,
      shippingDetails,
      paymentMethod: selectedPayment,
      paymentStatus: cart.paymentStatus,
      orderStatus: cart.paymentStatus,
      orderDate: new Date(),

      firstName: user.firstName,
      lastName: user.lastName,
      country: selectedShippingAddress.country,
      address: selectedShippingAddress.address,
      city: selectedShippingAddress.city,
      pincode: selectedShippingAddress.pincode,
      state: selectedShippingAddress.state,
      email: user.email,
      phone: user.mobileNo || "",
      products: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        Originalprice: item.originalPrice || item.price,
        price: item.price,
        size: item.selectedSize || item.size || "N/A",
      })),
      totalPrice: cart.totalPrice,
      paymentMethod: selectedPayment,
    };

    try {
      const res = await OrderServices.createOrder(orderData, token);
      const orderId = res?.orderId || res?.order?._id;

      if (orderId) {
        toast.success(`Order successfully placed`);
        navigate(`/`, {
          state: { orderId, paymentMethod: selectedPayment },
        });
      } else {
        console.log("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      toast.error("Order placement failed.");
    }
  };


  const handleDeleteAddress = async (id) => {
    try {
      // Call the deleteAddress service to delete the address
      await AddressServices.deleteAddress(id);

      // Remove the address from the state (frontend) after successful deletion
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== id)
      );

      toast.success("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address.");
    }
  };
  const handleEditClick = (id) => {
    navigate(`/edit-address/${id}`);
  };

  const handlePaymentChange = async (e) => {
    const method = e.target.value;
    setSelectedPayment(method); // e.g., "Online"

    if (method !== "Online") return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const selectedShippingAddress = addresses[selectedAddressIndex];

    if (!selectedShippingAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    const txnId = `TXN_${Date.now()}`;
    const shippingDetails = `${selectedShippingAddress.address}, ${selectedShippingAddress.city}, ${selectedShippingAddress.state}, ${selectedShippingAddress.country}, ${selectedShippingAddress.pincode}`;

    const orderData = {
      txnId,
      cartId: cart._id,
      userId: cart.userId?._id || user._id,
      userAddressId: selectedShippingAddress._id,
      totalProducts: cart.items.length,
      totalAmount: cart.totalPrice,
      gatewayAmount: cart.totalPrice,
      shippingAmount: 0,
      discountAmount: 0,
      grandTotal: cart.totalPrice,
      shippingDetails,
      paymentMethod: method,
      paymentStatus: "pending",
      orderStatus: "Pending",
      orderDate: new Date(),
      firstName: user.name?.split(" ")[0] || "",
      country: selectedShippingAddress.country,
      address: selectedShippingAddress.address,
      city: selectedShippingAddress.city,
      pincode: selectedShippingAddress.pincode,
      state: selectedShippingAddress.state,
      email: user.email,
      phone: user.mobileNo || "",
      products: cart.items.map((item) => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
        Originalprice: item.originalPrice || item.price,
        price: item.price,
        size: item.selectedSize || item.size || "N/A",
      })),
      totalPrice: cart.totalPrice,
    };

    console.log("Sending userId:", cart.userId?._id || user._id);

    try {
      // Step 1: Create temp order and get Razorpay order
      const res = await OrderServices.createOrder(orderData, token); // Should return { razorpayOrderId, amount, currency }
      const { razorpayOrderId, amount, currency } = res;

      const options = {
        key: "rzp_test_oVUaqVOJuonfo8", // Replace with your actual key
        amount,
        currency,
        name: "Your Store",
        description: "Online Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          console.log("razorpay_payment_id:", razorpay_payment_id);
          console.log("razorpay_signature:", razorpay_signature);

          try {
            // Step 2: Verify payment on backend
            const verifyRes = await OrderServices.verifyPayment(
              {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                userId: orderData.userId,
                signature: razorpay_signature,
                userAddressId: selectedShippingAddress._id,
                totalAmount: cart.totalPrice,
                grandTotal: cart.totalPrice,
                products: orderData.products,
                shippingDetails,
              },
              token
            );

            // Defensive checks
            if (verifyRes && verifyRes.success) {
              toast.success("Payment verified and order placed!");
              // TODO: clear cart or navigate to a thank you page
            } else {
              console.error("Unexpected verification response:", verifyRes);
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "email@example.com",
          contact: user?.mobileNo || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Online payment initiation failed:", error);
      toast.error("Failed to start payment.");
    }
  };

  if (loading || !cart)
    return <div className="text-center py-5">Loading...</div>;

  return (
    <>
      <HomeHeader />
      <section className="container py-5">
        <div className="row">
          {/* Left side: Address and order */}
          <div className="col-lg-8">
            <div className="card p-4 shadow-sm border rounded-4">
              <h3 className="mb-4">Billing Details</h3>

              <h5>Select Shipping Address</h5>
              {Array.from({ length: Math.ceil(addresses.length / 2) }).map(
                (_, rowIndex) => (
                  <div className="row" key={rowIndex}>
                    {addresses
                      .slice(rowIndex * 2, rowIndex * 2 + 2)
                      .map((addr, index) => {
                        const actualIndex = rowIndex * 2 + index;
                        return (
                          <div className="col-md-6" key={actualIndex}>
                            <div className="border p-3 rounded mb-3 mt-3">
                              <div>
                                <strong>
                                  {addr.firstName || addr.FirstName}
                                </strong>{" "}
                                <strong>
                                  {addr.lastName || addr.LastName}
                                </strong>{" "}
                                ({addr.phone})<br />
                                {addr.address}, {addr.city}, {addr.state} -{" "}
                                {addr.pincode}, {addr.country}
                                <input
                                  type="checkbox"
                                  name="selectedAddress"
                                  checked={selectedAddressIndex === actualIndex}
                                  onChange={() =>
                                    setSelectedAddressIndex(actualIndex)
                                  }
                                  className="me-2 "
                                  style={{
                                    transform: "scale(0.3)",
                                    marginRight: "8px",
                                  }}
                                />
                              </div>

                              <button
                                className="btn btn-primary mt-3"
                                onClick={() => handleEditClick(addr._id)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-primary mt-3 ms-2"
                                onClick={() => handleDeleteAddress(addr._id)}
                              >
                                Delete
                              </button>

                            </div>
                          </div>
                        );
                      })}
                  </div>
                )
              )}

              <hr />
              <h5>Add New Address</h5>
              <form onSubmit={handleAddNewAddress}>
                <div className="row">
                  {[
                    ["firstName", "FirstName"],
                    ["lastName", "lastName"],
                    ["phone", "Phone"],
                    ["address", "Address"],
                    ["city", "City"],
                    ["pincode", "Pincode"],
                    ["state", "State"],
                    ["country", "Country"],
                  ].map(([field, label]) => (
                    <div
                      key={field}
                      className={`${field === "address" ? "col-12" : "col-md-6"
                        } mb-2`}
                    >
                      <input
                        type="text"
                        name={field}
                        className="form-control"
                        placeholder={label}
                        value={newAddress[field]}
                        onChange={handleNewAddressChange}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn btn-secondary mt-2">
                  Add Address
                </button>
              </form>
            </div>
          </div>

          {/* Right side: Summary */}
          <div className="col-lg-4">
            <div className="card p-4 shadow-sm border rounded-4">
              <h4 className="fw-bold mb-3">Summary</h4>
              <div className="mb-2 d-flex justify-content-between">
                <span>Sub-Total</span>
                <span>
                  {currency.symbol}
                  {cart?.subTotal || cart?.totalPrice || 0}
                </span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span>Delivery Charges</span>
                <span>
                  {currency.symbol}
                  {cart?.deliveryCharge || 0}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total Amount</span>
                <span>
                  {currency.symbol}
                  {(cart?.totalPrice || 0) + (cart?.deliveryCharge || 0)}
                </span>
              </div>
              <hr />
              <h5 className="fw-semibold mb-2 mt-3">Products</h5>
              {cart?.items?.map((item) => (
                <div key={item._id} className="d-flex align-items-center mb-3">
                  <img
                    src={
                      item?.productId?.images?.[0]
                        ? `${process.env.REACT_APP_API_BASE_URL}/${item.productId.images[0]}`
                        : "https://via.placeholder.com/50"
                    }
                    alt={item.productId?.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <div>{item.productname}</div>
                    <small>
                      Qty: {item.quantity} | Size:{" "}
                      {item.selectedSize || item.size || "N/A"}
                    </small>
                    <br />
                    <strong>
                      {currency.symbol}
                      {item.price}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Box */}
            <div className="ec-sidebar-wrap shadow-sm border rounded-4 mt-4">
              <div className="ec-sidebar-block">
                <div className="ec-sb-title">
                  <h3 className="ec-sidebar-title">Payment Method</h3>
                </div>
                <div className="ec-sb-block-content">
                  <div className="ec-checkout-pay">
                    <div className="ec-pay-desc">
                      Please select the preferred payment method.
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input
                        type="radio"
                        className="form-check-input "
                        id="COD"
                        name="paymentMethod"
                        value="COD"
                        checked={selectedPayment === "COD"}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        style={{
                          width: "10px",
                          height: "20px",
                          border: "2px solid #000",

                          appearance: "none",
                          position: "relative",
                        }}
                      />
                      <label className="form-check-label ml-2" htmlFor="cod">
                        Cash On Delivery
                      </label>
                    </div>

                    <div className="form-check d-flex align-items-center">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="Online"
                        name="paymentMethod"
                        value="Online"
                        checked={selectedPayment === "Online"}
                        onChange={handlePaymentChange}
                        style={{
                          width: "10px",
                          height: "20px",
                          border: "2px solid #000",
                          appearance: "none",
                          position: "relative",
                        }}
                      />
                      <label className="form-check-label ml-2" htmlFor="Online">
                        Online
                      </label>
                    </div>


                    <textarea
                      className="form-control mt-3"
                      placeholder="Add comments about your order"
                    />
                    <div className="form-check align-items-center mt-2">
                      <input
                        className="form-check-input mt-1"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        style={{
                          width: "10px",
                          height: "20px",
                          border: "2px solid #000",
                          appearance: "none",
                          position: "relative",
                        }}
                      />
                      <Link to="/termscondition">
                        <label className="form-check-label ms-2 mt-2">
                          I agree to the Terms & Conditions
                        </label>
                      </Link>

                      <button
                        className="btn btn-primary btn-lg w-100 mt-4"
                        onClick={handlePaymentSubmit}
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment logos */}
            <div className="ec-sidebar-wrap ec-check-pay-img-wrap shadow-sm border rounded-4 mt-4">
              <div className="ec-sidebar-block">
                <div className="ec-sb-title">
                  <h3 className="ec-sidebar-title">Payment Logos</h3>
                </div>
                <div className="ec-sb-block-content d-flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <img
                      key={n}
                      src={`assets/images/icons/payment${n}.png`}
                      alt={`Payment ${n}`}
                      style={{ width: "45px" }}
                    />
                  ))}
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

export default OrderDetails;
