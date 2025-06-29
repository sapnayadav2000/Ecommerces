import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AdminServices from "../../services/adminServices";
import SideBar from './sidebar'
function Header() {
  const [admin, setAdmin] = useState({
    name: "",
    image: "",
    memberSince: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch Admin Profile Data
    const fetchProfile = async () => {
      try {
        const response = await AdminServices.getMyProfile();
        const { name, image, createdAt } = response.data;

        // Format the "createdAt" date to "Month, Year"
        const formattedDate = new Date(createdAt).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });

        setAdmin({
          name,
          image: `${process.env.REACT_APP_API_BASE_URL}/${image}`,
          memberSince: formattedDate,
        });
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const goToProfile = () => {
    navigate("/Profile");
  };

  return (
    <>
      <div className="top_nav">
        <div className="nav_menu">
          <nav>
            <div className="toggle">
             
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li className>
                <Link data-bs-toggle="modal" data-bs-target="#supportModal">
                  <img src="img/support.svg" alt="" />
                </Link>
              </li>
              <li className="profile-text">
                <Link
                  href="#"
                  data-bs-toggle="modal"
                  data-bs-target="#adminModel"
                  data-target="#demoModal"
                  className="d-flex align-items-center"
                >
                  <div className="admin-profile-img">
                    <img src={admin.image} alt="Profile" />
                  </div>
                  {admin.name}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div
        className="modal fade support-modal"
        id="supportModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" 
          
          style={{
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '900px',
  height: '350px',
  pointerEvents: 'auto',
  backgroundColor: '#ffffff',
  backgroundClip: 'padding-box',
  border: '1px solid black',
  backgroundColor:'#f0f3ff',width:'auto'

}}>
            <div className="modal-header">
              <h5 className="modal-title text-center">Support</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body px-5 py-4">
              <div className="row align-items-center justify-content-center">
                <div className="col-md-12">
                  <ul className="list-unstyled support-list">
                    <li className="modalbodyli  " >
                      <a href="tel:+91 98765 43210"  >+91 98765 43210</a>
                      <a
                        href="tel:+91 98765 43210"
                        className="contact-btn-right " 
                      >
                        <span>
                          <i className="fa fa-phone" />
                        </span>
                      </a>
                    </li>
                    <li className="modalbodyli mt-3">
                      <a href="mailto:support@greenheritageresort.com">
                        support@greenheritageresort.com
                      </a>
                      <a
                        href="mailto:support@greenheritageresort.com"
                        className="contact-btn-right"
                      >
                        <span>
                          <i className="fa fa-envelope" />
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="adminModel"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content"
                
          style={{
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '900px',
  height: '400px',
  pointerEvents: 'auto',
  backgroundColor: '#ffffff',
  backgroundClip: 'padding-box',
  border: '1px solid black',
  backgroundColor:'#f0f3ff',width:'auto'

}}>
            <div className="modal-body px-5 pb-0">
              <div className="row align-items-center">
                <div className="modal-body py-4 text-center">
                  <div className="admin-profile-img">
                  <img src={admin.image} alt="Profile" />
                  </div>
                  <h4>{admin.name}</h4>
                  <p className="desc my-2">Member Since {admin.memberSince}</p>
                </div>
              </div>
            </div>
            <div className="model-footer">
              <button
                className="site-btn btn"
                data-bs-dismiss="modal"
                onClick={goToProfile}
              >
                Profile
              </button>
              <button className="site-btn btn" onClick={logOut}>
                Sign out{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      <SideBar/>
    </>
  );
}

export default Header;
