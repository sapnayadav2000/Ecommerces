import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "../Footer";
import HomeHeader from "../HomeHeader";
import UserServices from "../../services/userservices";
import "./UserLogin.css";
import { toast } from "react-toastify";
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Retrieve saved credentials from cookies
  useEffect(() => {
    const rememberedEmail = Cookies.get("rememberEmail");
    const rememberedPassword = Cookies.get("rememberPassword");

    if (rememberedEmail) setEmail(rememberedEmail);
    if (rememberedPassword) setPassword(rememberedPassword);
  }, []);
  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Reset previous error messages

    try {
      const response = await UserServices.getLogin({ email, password });

      // Debug logs (optional)
      console.log("Full Response:", response);
      console.log("Token received:", response.token);
      console.log("Response Data:", response.data);

      // 🚫 Check if user status is inactive
      if (response?.data?.status === "Inactive") {
        setError("Your account is inactive. Please contact support.");
        toast.error("Your account is inactive. Please contact support.");
        return; // Stop further execution
      }

      // ✅ Proceed if status is not inactive and login is successful
      if (response?.status === true && response?.token) {
        toast.success("Login Successful!");

        // Store user data in localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.data._id);
        localStorage.setItem("userRole", response.data.userType);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("image", response.data.image || "");

        // Notify other components
        window.dispatchEvent(new Event("storage"));

        // Redirect to homepage
        setTimeout(() => {
          navigate("/user-profile");
          window.location.reload();
        }, 500);
      } else {
        console.error("Login failed. API response:", response);
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    }

  };


  return (
    <>
      <HomeHeader />
      <section className="ec-page-content section-space-p mt-5">
        <div className="ec-login-wrapper">
          <div className="ec-login-container">
            <div className="ec-login-form">
              <form onSubmit={handleLogin}>
                <span className="ec-login-wrap">
                  <label>Email Address*</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Enter your email..."
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </span>
                <span className="ec-login-wrap">
                  <label>Password*</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </span>
                {error && <p className="error-message">{error}</p>}
                <span className="ec-login-wrap ec-login-btn">
                  <button className="btn border" style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))', borderRadius: '10px' }} type="submit">
                    Login
                  </button>
                  <Link to="/register">
                    <p className="text-center mt-3">Don't have  an account?<span style={{ color: '#e5106f ' }}> Register Now</span></p>
                  </Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default UserLogin;
