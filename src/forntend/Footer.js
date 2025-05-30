import React from "react";

export default function Footer() {
  return (
    <footer className="ec-footer mt-4">
      <div className="container">
        <div className="footer-top section-space-footer-p">
          <div className="container">
            <div className="row">
              {/* Account Section */}
              <div className="col-sm-12 col-md-6 col-lg-3 ec-footer-account">
                <div className="ec-footer-widget">
                  <h4 className="ecs-footer-heading">Account</h4>
                  <ul className="ec-footer-links">
                    <li>
                      <a href="/user-profile">My Account</a>
                    </li>
                    <li>
                      <a href="/Your-Orders"> Your Orders </a>
                    </li>
                    <li>
                      <a href="/wishlist">Wish List</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Services Section */}
              <div className="col-sm-12 col-md-6 col-lg-3 ec-footer-service">
                <div className="ec-footer-widget">
                  <h4 className="ecs-footer-heading">Services</h4>
                  <ul className="ec-footer-links">
                    <li>
                      <a href="/privacy-policy">Policy & Policy</a>
                    </li>
                    <li>
                      <a href="/termscondition">Terms & Conditions</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Information Section */}
              <div className="col-sm-12 col-md-6 col-lg-3 ec-footer-info">
                <div className="ec-footer-widget">
                  <h4 className="ecs-footer-heading">Information</h4>
                  <ul className="ec-footer-links">
                    <li>
                      <a href="/about">About us</a>
                    </li>

                    <li>
                      <a href="/Your-Orders">Delivery Information</a>
                    </li>
                    <li>
                      <a href="/contact-us">Contact us</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Location Section */}
              <div className="col-sm-12 col-md-6 col-lg-3 ec-footer-contact">
                <div className="ec-footer-widget">
                  <h4 className="ecs-footer-heading">Location</h4>
                  <ul className="ec-footer-links">
                    <li>
                      <i className="fas fa-map-marker-alt" /> 71 Pilgrim Avenue
                      Chevy Chase, MD 20815, USA
                    </li>
                    <li>
                      <i className="fas fa-phone" /> +91 5241234589
                    </li>
                    <li>
                      <i className="fas fa-envelope" />{" "}
                      example123@gmail.com
                    </li>
                  </ul>

                  {/* Social Links */}
                  {/* <div className="ecs-footer-social mt-3">
                    <ul className="d-flex justify-content-start">
                      <li className="ml-3">
                        <a href="#">
                        <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li  className="ml-3">
                        <a href="#">
                        <i className="fab fa-twitter"></i>
                        </a>
                      </li>
                      <li  className="ml-3">
                        <a href="#">
                        <i className="fab fa-instagram"></i>
                        </a>
                      </li>
                      <li  className="ml-3">
                        <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center">
              {/* Copyright */}
              <div className="col-md-6 text-center text-md-start footer-copy">
                <p className="m-0" style={{ color: 'white' }}>
                  Copyright © {new Date().getFullYear()}{" "}
                  <a
                    className="site-name text-upper"
                    href="index.html"
                    style={{ color: 'black', textDecoration: 'none' }}
                  >
                    Websuntech
                  </a>{" "}
                  . All Rights Reserved.
                </p>
              </div>


              {/* Payment Icons */}
              <div className="col-md-6 text-center text-md-end footer-bottom-right">
                <div className="footer-bottom-payment">
                  <img
                    src="/assets/images/icons/payment.png"
                    alt="Payment Methods"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
