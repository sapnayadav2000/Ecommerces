import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import UserServices from "../../services/userservices";
import { toast } from "react-toastify";
const UserProfile = () => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logout Successfully");
    localStorage.clear();
    navigate("/login");

    setTimeout(() => {
      window.location.reload();
    }, 1500); // 1.5 seconds delay so toast can show
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if token not found
        return;
      }

      const response = await UserServices.getMyProfile(token);
      console.log("data", response);
      if (response.status && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        console.error(
          "Profile fetch failed:",
          response.message || "Unknown error"
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!user) return null; // Or show a loading spinner

  return (
    <>
      <HomeHeader />
      <section className="ec-page-content ec-vendor-uploads ec-user-account section-space-p">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="ec-shop-leftside ec-vendor-sidebar col-lg-3 col-md-12">
              <div className="ec-sidebar-wrap ec-border-box">
                <div className="ec-sidebar-block">
                  <div className="ec-vendor-block">
                    <div className="ec-vendor-block-items">
                      <ul>
                        <li>
                          <Link to="/user-profile">User Profile</Link>
                        </li>
                        <li>
                          <Link to="/wishlist">Wishlist</Link>
                        </li>
                        <li>
                          <Link to="/add-to-cart">Cart</Link>
                        </li>
                        <li>
                          <Link to="/Your-Orders">Your Orders</Link>
                        </li>
                        {/* <li>
                          <Link to="/track-order">Track Order</Link>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="ec-shop-rightside col-lg-9 col-md-12">
              <div className="ec-vendor-dashboard-card ec-vendor-setting-card">
                <div className="ec-vendor-card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="ec-vendor-block-profile">
                        <div className="ec-vendor-block-img space-bottom-30">
                          <div className="ec-vendor-block-bg">
                            <button
                              className="btn btn-lg btn-primary"
                              onClick={() => navigate("/user-profile-edit")}
                            >
                              Edit Detail
                            </button>
                          </div>
                          <div className="ec-vendor-block-detail">
                            <img
                              className="v-img"
                              src={`${process.env.REACT_APP_API_BASE_URL}/${user?.image}`}
                              alt="User"
                            />
                            <h5 className="name">{user?.firstName} {user?.lastName}</h5>
                            <p>({user?.userType})</p>
                          </div>
                          <p>
                            Hello <span>{user?.firstName} {user?.lastName}</span>
                          </p>
                          <p>
                            From your account, you can easily view and track
                            orders. Manage your account information, address,
                            and order history.
                          </p>
                        </div>

                        <h5>Account Information</h5>
                        <div className="row">
                          <div className="col-md-6 col-sm-12">
                            <div className="ec-vendor-detail-block space-bottom-30">
                              <p className="mb-2">Email</p>
                              <h6> {user?.email}</h6>

                            </div>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <div className="ec-vendor-detail-block space-bottom-30">
                              <p className="mb-2">Mobil NO.</p>
                              <h6>{user?.mobileNo}</h6>

                            </div>
                          </div>
                          <div className="col-md-6 col-sm-12">
                            <div className="ec-vendor-detail-block">
                              <p className="mb-2">Address</p>
                              <h6> {user?.address}, {user?.city}, {user?.state} -{" "}
                                {user?.pincode}</h6>

                            </div>
                          </div>
                        </div>

                        <div className="text-center mt-3">
                          <button
                            className="btn"
                            onClick={handleLogout} style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))' }}
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
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

export default UserProfile;
