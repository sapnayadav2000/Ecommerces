import React from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";

const CheckOut = () => {
  return (
    <>
      <div className="Container">
        <HomeHeader />

        <div className="sticky-header-next-sec  ec-breadcrumb section-space-mb">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="row ec_breadcrumb_inner">
                  <div className="col-md-6 col-sm-12">
                    <h2 className="ec-breadcrumb-title">Checkout</h2>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    {/* ec-breadcrumb-list start */}
                    <ul className="ec-breadcrumb-list">
                      <li className="ec-breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li className="ec-breadcrumb-item active">Checkout</li>
                    </ul>
                    {/* ec-breadcrumb-list end */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="ec-page-content section-space-p">
          <div className="container">
            <div className="row">
              <div className="ec-checkout-leftside col-lg-8 col-md-12 ">
                {/* checkout content Start */}
                <div className="ec-checkout-content">
                  <div className="ec-checkout-inner">
                    <div className="ec-checkout-wrap margin-bottom-30">
                      <div className="ec-checkout-block ec-check-new">
                        <h3 className="ec-checkout-title">New Customer</h3>
                        <div className="ec-check-block-content">
                          <div className="ec-check-subtitle">
                            Checkout Options
                          </div>
                          <form action="#">
                            <span className="ec-new-option">
                              <span>
                                <input
                                  type="radio"
                                  id="account1"
                                  name="radio-group"
                                  defaultChecked=""
                                />
                                <label htmlFor="account1">
                                  Register Account
                                </label>
                              </span>
                              <span>
                                <input
                                  type="radio"
                                  id="account2"
                                  name="radio-group"
                                />
                                <label htmlFor="account2">Guest Account</label>
                              </span>
                            </span>
                          </form>
                          <div className="ec-new-desc">
                            By creating an account you will be able to shop
                            faster, be up to date on an order's status, and keep
                            track of the orders you have previously made.
                          </div>
                          <div className="ec-new-btn">
                            <a href="#" className="btn btn-primary">
                              Continue
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="ec-checkout-block ec-check-login">
                        <h3 className="ec-checkout-title">
                          Returning Customer
                        </h3>
                        <div className="ec-check-login-form">
                          <form action="#" method="post">
                            <span className="ec-check-login-wrap">
                              <label>Email Address</label>
                              <input
                                type="text"
                                name="name"
                                placeholder="Enter your email address"
                                required=""
                              />
                            </span>
                            <span className="ec-check-login-wrap">
                              <label>Password</label>
                              <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                required=""
                              />
                            </span>
                            <span className="ec-check-login-wrap ec-check-login-btn">
                              <button className="btn btn-primary" type="submit">
                                Login
                              </button>
                              <a className="ec-check-login-fp" href="#">
                                Forgot Password?
                              </a>
                            </span>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="ec-checkout-wrap margin-bottom-30 padding-bottom-3">
                      <div className="ec-checkout-block ec-check-bill">
                        <h3 className="ec-checkout-title">Billing Details</h3>
                        <div className="ec-bl-block-content">
                          <div className="ec-check-subtitle">
                            Checkout Options
                          </div>
                          <span className="ec-bill-option">
                            <span>
                              <input
                                type="radio"
                                id="bill1"
                                name="radio-group"
                              />
                              <label htmlFor="bill1">
                                I want to use an existing address
                              </label>
                            </span>
                            <span>
                              <input
                                type="radio"
                                id="bill2"
                                name="radio-group"
                                defaultChecked=""
                              />
                              <label htmlFor="bill2">
                                I want to use new address
                              </label>
                            </span>
                          </span>
                          <div className="ec-check-bill-form">
                            <form action="#" method="post">
                              <span className="ec-bill-wrap ec-bill-half">
                                <label>First Name*</label>
                                <input
                                  type="text"
                                  name="firstname"
                                  placeholder="Enter your first name"
                                  required=""
                                />
                              </span>
                              <span className="ec-bill-wrap ec-bill-half">
                                <label>Last Name*</label>
                                <input
                                  type="text"
                                  name="lastname"
                                  placeholder="Enter your last name"
                                  required=""
                                />
                              </span>
                              <span className="ec-bill-wrap">
                                <label>Address</label>
                                <input
                                  type="text"
                                  name="address"
                                  placeholder="Address Line 1"
                                />
                              </span>
                              <span className="ec-bill-wrap ec-bill-half">
                                <label>City *</label>
                                <span className="ec-bl-select-inner">
                                  <select
                                    name="ec_select_city"
                                    id="ec-select-city"
                                    className="ec-bill-select"
                                  >
                                    <option selected="" disabled="">
                                      City
                                    </option>
                                    <option value={1}>City 1</option>
                                    <option value={2}>City 2</option>
                                    <option value={3}>City 3</option>
                                    <option value={4}>City 4</option>
                                    <option value={5}>City 5</option>
                                  </select>
                                </span>
                              </span>
                              <span className="ec-bill-wrap ec-bill-half">
                                <label>Post Code</label>
                                <input
                                  type="text"
                                  name="postalcode"
                                  placeholder="Post Code"
                                />
                              </span>
                              <span className="ec-bill-wrap ec-bill-half">
                                <label>Country *</label>
                                <span className="ec-bl-select-inner">
                                  <select
                                    name="ec_select_country"
                                    id="ec-select-country"
                                    className="ec-bill-select"
                                  >
                                    <option selected="" disabled="">
                                      Country
                                    </option>
                                    <option value={1}>Country 1</option>
                                    <option value={2}>Country 2</option>
                                    <option value={3}>Country 3</option>
                                    <option value={4}>Country 4</option>
                                    <option value={5}>Country 5</option>
                                  </select>
                                </span>
                              </span>
                              <span className="ec-bill-wrap ec-bill-half">
                                <label>Region State</label>
                                <span className="ec-bl-select-inner">
                                  <select
                                    name="ec_select_state"
                                    id="ec-select-state"
                                    className="ec-bill-select"
                                  >
                                    <option selected="" disabled="">
                                      Region/State
                                    </option>
                                    <option value={1}>Region/State 1</option>
                                    <option value={2}>Region/State 2</option>
                                    <option value={3}>Region/State 3</option>
                                    <option value={4}>Region/State 4</option>
                                    <option value={5}>Region/State 5</option>
                                  </select>
                                </span>
                              </span>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="ec-check-order-btn">
                      <a className="btn btn-primary" href="#">
                        Place Order
                      </a>
                    </span>
                  </div>
                </div>
                {/*cart content End */}
              </div>
              {/* Sidebar Area Start */}
              <div className="ec-checkout-rightside col-lg-4 col-md-12">
                <div className="ec-sidebar-wrap">
                  {/* Sidebar Summary Block */}
                  <div className="ec-sidebar-block">
                    <div className="ec-sb-title">
                      <h3 className="ec-sidebar-title">Summary</h3>
                    </div>
                    <div className="ec-sb-block-content">
                      <div className="ec-checkout-summary">
                        <div>
                          <span className="text-left">Sub-Total</span>
                          <span className="text-right">$80.00</span>
                        </div>
                        <div>
                          <span className="text-left">Delivery Charges</span>
                          <span className="text-right">$80.00</span>
                        </div>
                        <div>
                          <span className="text-left">Coupan Discount</span>
                          <span className="text-right">
                            <a className="ec-checkout-coupan">Apply Coupan</a>
                          </span>
                        </div>
                        <div className="ec-checkout-coupan-content">
                          <form
                            className="ec-checkout-coupan-form"
                            name="ec-checkout-coupan-form"
                            method="post"
                            action="#"
                          >
                            <input
                              className="ec-coupan"
                              type="text"
                              required=""
                              placeholder="Enter Your Coupan Code"
                              name="ec-coupan"
                              defaultValue=""
                            />
                            <button
                              className="ec-coupan-btn button btn-primary"
                              type="submit"
                              name="subscribe"
                              value=""
                            >
                              Apply
                            </button>
                          </form>
                        </div>
                        <div className="ec-checkout-summary-total">
                          <span className="text-left">Total Amount</span>
                          <span className="text-right">$80.00</span>
                        </div>
                      </div>
                      <div className="ec-checkout-pro">
                        <div className="col-sm-12 mb-6">
                          <div className="ec-product-inner">
                            <div className="ec-pro-image-outer">
                              <div className="ec-pro-image">
                                <a
                                  href="product-left-sidebar.html"
                                  className="image"
                                >
                                  <img
                                    className="main-image"
                                    src="assets/images/product-image/1_1.jpg"
                                    alt="Product"
                                  />
                                  <img
                                    className="hover-image"
                                    src="assets/images/product-image/1_2.jpg"
                                    alt="Product"
                                  />
                                </a>
                              </div>
                            </div>
                            <div className="ec-pro-content">
                              <h5 className="ec-pro-title">
                                <a href="product-left-sidebar.html">
                                  Baby toy teddy bear
                                </a>
                              </h5>
                              <div className="ec-pro-rating">
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star" />
                              </div>
                              <span className="ec-price">
                                <span className="old-price">$95.00</span>
                                <span className="new-price">$79.00</span>
                              </span>
                              <div className="ec-pro-option">
                                <div className="ec-pro-color">
                                  <span className="ec-pro-opt-label">
                                    Color
                                  </span>
                                  <ul className="ec-opt-swatch ec-change-img">
                                    <li className="active">
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/1_1.jpg"
                                        data-src-hover="assets/images/product-image/1_1.jpg"
                                        data-tooltip="Gray"
                                      >
                                        <span
                                          style={{ backgroundColor: "#6d4c36" }}
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/1_2.jpg"
                                        data-src-hover="assets/images/product-image/1_2.jpg"
                                        data-tooltip="Orange"
                                      >
                                        <span
                                          style={{ backgroundColor: "#ffb0e1" }}
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/1_3.jpg"
                                        data-src-hover="assets/images/product-image/1_3.jpg"
                                        data-tooltip="Green"
                                      >
                                        <span
                                          style={{ backgroundColor: "#8beeff" }}
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/1_4.jpg"
                                        data-src-hover="assets/images/product-image/1_4.jpg"
                                        data-tooltip="Sky Blue"
                                      >
                                        <span
                                          style={{ backgroundColor: "#74f8d1" }}
                                        />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="ec-pro-size">
                                  <span className="ec-pro-opt-label">Size</span>
                                  <ul className="ec-opt-size">
                                    <li className="active">
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$95.00"
                                        data-new="$79.00"
                                        data-tooltip="Small"
                                      >
                                        S
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$90.00"
                                        data-new="$70.00"
                                        data-tooltip="Medium"
                                      >
                                        M
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$80.00"
                                        data-new="$60.00"
                                        data-tooltip="Large"
                                      >
                                        X
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$70.00"
                                        data-new="$50.00"
                                        data-tooltip="Extra Large"
                                      >
                                        XL
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-12 mb-0">
                          <div className="ec-product-inner">
                            <div className="ec-pro-image-outer">
                              <div className="ec-pro-image">
                                <a
                                  href="product-left-sidebar.html"
                                  className="image"
                                >
                                  <img
                                    className="main-image"
                                    src="assets/images/product-image/8_1.jpg"
                                    alt="Product"
                                  />
                                  <img
                                    className="hover-image"
                                    src="assets/images/product-image/8_2.jpg"
                                    alt="Product"
                                  />
                                </a>
                              </div>
                            </div>
                            <div className="ec-pro-content">
                              <h5 className="ec-pro-title">
                                <a href="product-left-sidebar.html">
                                  Smart I watch 2GB
                                </a>
                              </h5>
                              <div className="ec-pro-rating">
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star fill" />
                                <i className="ecicon eci-star" />
                              </div>
                              <span className="ec-price">
                                <span className="old-price">$58.00</span>
                                <span className="new-price">$45.00</span>
                              </span>
                              <div className="ec-pro-option">
                                <div className="ec-pro-color">
                                  <span className="ec-pro-opt-label">
                                    Color
                                  </span>
                                  <ul className="ec-opt-swatch ec-change-img">
                                    <li className="active">
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/8_2.jpg"
                                        data-src-hover="assets/images/product-image/8_2.jpg"
                                        data-tooltip="Gray"
                                      >
                                        <span
                                          style={{ backgroundColor: "#f3f3f3" }}
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/8_3.jpg"
                                        data-src-hover="assets/images/product-image/8_3.jpg"
                                        data-tooltip="Orange"
                                      >
                                        <span
                                          style={{ backgroundColor: "#fac7f3" }}
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-clr-img"
                                        data-src="assets/images/product-image/8_4.jpg"
                                        data-src-hover="assets/images/product-image/8_4.jpg"
                                        data-tooltip="Green"
                                      >
                                        <span
                                          style={{ backgroundColor: "#c5f1ff" }}
                                        />
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="ec-pro-size">
                                  <span className="ec-pro-opt-label">Size</span>
                                  <ul className="ec-opt-size">
                                    <li className="active">
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$48.00"
                                        data-new="$45.00"
                                        data-tooltip="Small"
                                      >
                                        S
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$90.00"
                                        data-new="$70.00"
                                        data-tooltip="Medium"
                                      >
                                        M
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$80.00"
                                        data-new="$60.00"
                                        data-tooltip="Large"
                                      >
                                        X
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        href="#"
                                        className="ec-opt-sz"
                                        data-old="$70.00"
                                        data-new="$50.00"
                                        data-tooltip="Extra Large"
                                      >
                                        XL
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Sidebar Summary Block */}
                </div>
                <div className="ec-sidebar-wrap ec-checkout-del-wrap">
                  {/* Sidebar Summary Block */}
                  <div className="ec-sidebar-block">
                    <div className="ec-sb-title">
                      <h3 className="ec-sidebar-title">Delivery Method</h3>
                    </div>
                    <div className="ec-sb-block-content">
                      <div className="ec-checkout-del">
                        <div className="ec-del-desc">
                          Please select the preferred shipping method to use on
                          this order.
                        </div>
                        <form action="#">
                          <span className="ec-del-option">
                            <span>
                              <span className="ec-del-opt-head">
                                Free Shipping
                              </span>
                              <input
                                type="radio"
                                id="del1"
                                name="radio-group"
                                defaultChecked=""
                              />
                              <label htmlFor="del1">Rate - $0 .00</label>
                            </span>
                            <span>
                              <span className="ec-del-opt-head">Flat Rate</span>
                              <input
                                type="radio"
                                id="del2"
                                name="radio-group"
                              />
                              <label htmlFor="del2">Rate - $5.00</label>
                            </span>
                          </span>
                          <span className="ec-del-commemt">
                            <span className="ec-del-opt-head">
                              Add Comments About Your Order
                            </span>
                            <textarea
                              name="your-commemt"
                              placeholder="Comments"
                              defaultValue={""}
                            />
                          </span>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* Sidebar Summary Block */}
                </div>
                <div className="ec-sidebar-wrap ec-checkout-pay-wrap">
                  {/* Sidebar Payment Block */}
                  <div className="ec-sidebar-block">
                    <div className="ec-sb-title">
                      <h3 className="ec-sidebar-title">Payment Method</h3>
                    </div>
                    <div className="ec-sb-block-content">
                      <div className="ec-checkout-pay">
                        <div className="ec-pay-desc">
                          Please select the preferred payment method to use on
                          this order.
                        </div>
                        <form action="#">
                          <span className="ec-pay-option">
                            <span>
                              <input
                                type="radio"
                                id="pay1"
                                name="radio-group"
                                defaultChecked=""
                              />
                              <label htmlFor="pay1">Cash On Delivery</label>
                            </span>
                          </span>
                          <span className="ec-pay-commemt">
                            <span className="ec-pay-opt-head">
                              Add Comments About Your Order
                            </span>
                            <textarea
                              name="your-commemt"
                              placeholder="Comments"
                              defaultValue={""}
                            />
                          </span>
                          <span className="ec-pay-agree">
                            <input type="checkbox" defaultValue="" />
                            <a href="#">
                              I have read and agree to the{" "}
                              <span>Terms &amp; Conditions</span>
                            </a>
                            <span className="checked" />
                          </span>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* Sidebar Payment Block */}
                </div>
                <div className="ec-sidebar-wrap ec-check-pay-img-wrap">
                  {/* Sidebar Payment Block */}
                  <div className="ec-sidebar-block">
                    <div className="ec-sb-title">
                      <h3 className="ec-sidebar-title">Payment Method</h3>
                    </div>
                    <div className="ec-sb-block-content">
                      <div className="ec-check-pay-img-inner">
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment1.png" alt="" />
                        </div>
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment2.png" alt="" />
                        </div>
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment3.png" alt="" />
                        </div>
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment4.png" alt="" />
                        </div>
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment5.png" alt="" />
                        </div>
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment6.png" alt="" />
                        </div>
                        <div className="ec-check-pay-img">
                          <img src="assets/images/icons/payment7.png" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Sidebar Payment Block */}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section ec-new-product section-space-p">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="section-title">
                  <h2 className="ec-bg-title">New Arrivals</h2>
                  <h2 className="ec-title">New Arrivals</h2>
                  <p className="sub-title">
                    Browse The Collection of Top Products
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              {/* New Product Content */}
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6 pro-gl-content">
                <div className="ec-product-inner">
                  <div className="ec-pro-image-outer">
                    <div className="ec-pro-image">
                      <a href="product-left-sidebar.html" className="image">
                        <img
                          className="main-image"
                          src="assets/images/product-image/6_1.jpg"
                          alt="Product"
                        />
                        <img
                          className="hover-image"
                          src="assets/images/product-image/6_2.jpg"
                          alt="Product"
                        />
                      </a>
                      <span className="percentage">20%</span>
                      <a
                        href="#"
                        className="quickview"
                        data-link-action="quickview"
                        title="Quick view"
                        data-bs-toggle="modal"
                        data-bs-target="#ec_quickview_modal"
                      >
                        <i className="fi-rr-eye" />
                      </a>
                      <div className="ec-pro-actions">
                        <a
                          href="compare.html"
                          className="ec-btn-group compare"
                          title="Compare"
                        >
                          <i className="fi fi-rr-arrows-repeat" />
                        </a>
                        <button title="Add To Cart" className="add-to-cart">
                          <i className="fi-rr-shopping-basket" /> Add To Cart
                        </button>
                        <a className="ec-btn-group wishlist" title="Wishlist">
                          <i className="fi-rr-heart" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="ec-pro-content">
                    <h5 className="ec-pro-title">
                      <a href="product-left-sidebar.html">Round Neck T-Shirt</a>
                    </h5>
                    <div className="ec-pro-rating">
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star" />
                    </div>
                    <div className="ec-pro-list-desc">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum is simply dutmmy text
                      ever since the 1500s, when an unknown printer took a
                      galley.
                    </div>
                    <span className="ec-price">
                      <span className="old-price">$27.00</span>
                      <span className="new-price">$22.00</span>
                    </span>
                    <div className="ec-pro-option">
                      <div className="ec-pro-color">
                        <span className="ec-pro-opt-label">Color</span>
                        <ul className="ec-opt-swatch ec-change-img">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/6_1.jpg"
                              data-src-hover="assets/images/product-image/6_1.jpg"
                              data-tooltip="Gray"
                            >
                              <span style={{ backgroundColor: "#e8c2ff" }} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/6_2.jpg"
                              data-src-hover="assets/images/product-image/6_2.jpg"
                              data-tooltip="Orange"
                            >
                              <span style={{ backgroundColor: "#9cfdd5" }} />
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="ec-pro-size">
                        <span className="ec-pro-opt-label">Size</span>
                        <ul className="ec-opt-size">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$25.00"
                              data-new="$20.00"
                              data-tooltip="Small"
                            >
                              S
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$27.00"
                              data-new="$22.00"
                              data-tooltip="Medium"
                            >
                              M
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$35.00"
                              data-new="$30.00"
                              data-tooltip="Extra Large"
                            >
                              XL
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6 pro-gl-content">
                <div className="ec-product-inner">
                  <div className="ec-pro-image-outer">
                    <div className="ec-pro-image">
                      <a href="product-left-sidebar.html" className="image">
                        <img
                          className="main-image"
                          src="assets/images/product-image/7_1.jpg"
                          alt="Product"
                        />
                        <img
                          className="hover-image"
                          src="assets/images/product-image/7_2.jpg"
                          alt="Product"
                        />
                      </a>
                      <span className="percentage">20%</span>
                      <span className="flags">
                        <span className="sale">Sale</span>
                      </span>
                      <a
                        href="#"
                        className="quickview"
                        data-link-action="quickview"
                        title="Quick view"
                        data-bs-toggle="modal"
                        data-bs-target="#ec_quickview_modal"
                      >
                        <i className="fi-rr-eye" />
                      </a>
                      <div className="ec-pro-actions">
                        <a
                          href="compare.html"
                          className="ec-btn-group compare"
                          title="Compare"
                        >
                          <i className="fi fi-rr-arrows-repeat" />
                        </a>
                        <button title="Add To Cart" className="add-to-cart">
                          <i className="fi-rr-shopping-basket" /> Add To Cart
                        </button>
                        <a className="ec-btn-group wishlist" title="Wishlist">
                          <i className="fi-rr-heart" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="ec-pro-content">
                    <h5 className="ec-pro-title">
                      <a href="product-left-sidebar.html">Full Sleeve Shirt</a>
                    </h5>
                    <div className="ec-pro-rating">
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star" />
                    </div>
                    <div className="ec-pro-list-desc">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum is simply dutmmy text
                      ever since the 1500s, when an unknown printer took a
                      galley.
                    </div>
                    <span className="ec-price">
                      <span className="old-price">$12.00</span>
                      <span className="new-price">$10.00</span>
                    </span>
                    <div className="ec-pro-option">
                      <div className="ec-pro-color">
                        <span className="ec-pro-opt-label">Color</span>
                        <ul className="ec-opt-swatch ec-change-img">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/7_1.jpg"
                              data-src-hover="assets/images/product-image/7_1.jpg"
                              data-tooltip="Gray"
                            >
                              <span style={{ backgroundColor: "#01f1f1" }} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/7_2.jpg"
                              data-src-hover="assets/images/product-image/7_2.jpg"
                              data-tooltip="Orange"
                            >
                              <span style={{ backgroundColor: "#b89df8" }} />
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="ec-pro-size">
                        <span className="ec-pro-opt-label">Size</span>
                        <ul className="ec-opt-size">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$12.00"
                              data-new="$10.00"
                              data-tooltip="Small"
                            >
                              S
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$15.00"
                              data-new="$12.00"
                              data-tooltip="Medium"
                            >
                              M
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$20.00"
                              data-new="$17.00"
                              data-tooltip="Extra Large"
                            >
                              XL
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6 pro-gl-content">
                <div className="ec-product-inner">
                  <div className="ec-pro-image-outer">
                    <div className="ec-pro-image">
                      <a href="product-left-sidebar.html" className="image">
                        <img
                          className="main-image"
                          src="assets/images/product-image/1_1.jpg"
                          alt="Product"
                        />
                        <img
                          className="hover-image"
                          src="assets/images/product-image/1_2.jpg"
                          alt="Product"
                        />
                      </a>
                      <span className="percentage">20%</span>
                      <span className="flags">
                        <span className="sale">Sale</span>
                      </span>
                      <a
                        href="#"
                        className="quickview"
                        data-link-action="quickview"
                        title="Quick view"
                        data-bs-toggle="modal"
                        data-bs-target="#ec_quickview_modal"
                      >
                        <i className="fi-rr-eye" />
                      </a>
                      <div className="ec-pro-actions">
                        <a
                          href="compare.html"
                          className="ec-btn-group compare"
                          title="Compare"
                        >
                          <i className="fi fi-rr-arrows-repeat" />
                        </a>
                        <button title="Add To Cart" className="add-to-cart">
                          <i className="fi-rr-shopping-basket" /> Add To Cart
                        </button>
                        <a className="ec-btn-group wishlist" title="Wishlist">
                          <i className="fi-rr-heart" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="ec-pro-content">
                    <h5 className="ec-pro-title">
                      <a href="product-left-sidebar.html">Cute Baby Toy's</a>
                    </h5>
                    <div className="ec-pro-rating">
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star" />
                    </div>
                    <div className="ec-pro-list-desc">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum is simply dutmmy text
                      ever since the 1500s, when an unknown printer took a
                      galley.
                    </div>
                    <span className="ec-price">
                      <span className="old-price">$40.00</span>
                      <span className="new-price">$30.00</span>
                    </span>
                    <div className="ec-pro-option">
                      <div className="ec-pro-color">
                        <span className="ec-pro-opt-label">Color</span>
                        <ul className="ec-opt-swatch ec-change-img">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/1_1.jpg"
                              data-src-hover="assets/images/product-image/1_1.jpg"
                              data-tooltip="Gray"
                            >
                              <span style={{ backgroundColor: "#90cdf7" }} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/1_2.jpg"
                              data-src-hover="assets/images/product-image/1_2.jpg"
                              data-tooltip="Orange"
                            >
                              <span style={{ backgroundColor: "#ff3b66" }} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/1_3.jpg"
                              data-src-hover="assets/images/product-image/1_3.jpg"
                              data-tooltip="Green"
                            >
                              <span style={{ backgroundColor: "#ffc476" }} />
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/1_4.jpg"
                              data-src-hover="assets/images/product-image/1_4.jpg"
                              data-tooltip="Sky Blue"
                            >
                              <span style={{ backgroundColor: "#1af0ba" }} />
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="ec-pro-size">
                        <span className="ec-pro-opt-label">Size</span>
                        <ul className="ec-opt-size">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$40.00"
                              data-new="$30.00"
                              data-tooltip="Small"
                            >
                              S
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="ec-opt-sz"
                              data-old="$50.00"
                              data-new="$40.00"
                              data-tooltip="Medium"
                            >
                              M
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-6 pro-gl-content">
                <div className="ec-product-inner">
                  <div className="ec-pro-image-outer">
                    <div className="ec-pro-image">
                      <a href="product-left-sidebar.html" className="image">
                        <img
                          className="main-image"
                          src="assets/images/product-image/2_1.jpg"
                          alt="Product"
                        />
                        <img
                          className="hover-image"
                          src="assets/images/product-image/2_2.jpg"
                          alt="Product"
                        />
                      </a>
                      <span className="percentage">20%</span>
                      <span className="flags">
                        <span className="new">New</span>
                      </span>
                      <a
                        href="#"
                        className="quickview"
                        data-link-action="quickview"
                        title="Quick view"
                        data-bs-toggle="modal"
                        data-bs-target="#ec_quickview_modal"
                      >
                        <i className="fi-rr-eye" />
                      </a>
                      <div className="ec-pro-actions">
                        <a
                          href="compare.html"
                          className="ec-btn-group compare"
                          title="Compare"
                        >
                          <i className="fi fi-rr-arrows-repeat" />
                        </a>
                        <button title="Add To Cart" className="add-to-cart">
                          <i className="fi-rr-shopping-basket" /> Add To Cart
                        </button>
                        <a className="ec-btn-group wishlist" title="Wishlist">
                          <i className="fi-rr-heart" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="ec-pro-content">
                    <h5 className="ec-pro-title">
                      <a href="product-left-sidebar.html">Jumbo Carry Bag</a>
                    </h5>
                    <div className="ec-pro-rating">
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star fill" />
                      <i className="ecicon eci-star" />
                    </div>
                    <div className="ec-pro-list-desc">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum is simply dutmmy text
                      ever since the 1500s, when an unknown printer took a
                      galley.
                    </div>
                    <span className="ec-price">
                      <span className="old-price">$50.00</span>
                      <span className="new-price">$40.00</span>
                    </span>
                    <div className="ec-pro-option">
                      <div className="ec-pro-color">
                        <span className="ec-pro-opt-label">Color</span>
                        <ul className="ec-opt-swatch ec-change-img">
                          <li className="active">
                            <a
                              href="#"
                              className="ec-opt-clr-img"
                              data-src="assets/images/product-image/2_1.jpg"
                              data-src-hover="assets/images/product-image/2_2.jpg"
                              data-tooltip="Gray"
                            >
                              <span style={{ backgroundColor: "#fdbf04" }} />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 shop-all-btn">
                <a href="#">Shop All Collection</a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default CheckOut;
