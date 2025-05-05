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

      console.log("Full Response:", response); // ✅ Logs the entire response object
      console.log("Token received:", response.token); // ✅ Correct way to access token
      console.log("Response Data:", response.data); // ✅ Logs user details

      // ✅ Check if token exists (fixing the issue)
      if (response?.status === true && response?.token) {
        toast.success("Login Successful!");

        // Store authentication details
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.data._id);
        localStorage.setItem("userRole", response.data.userType);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("image", response.data.image || "");

        // Notify other components about login state change
        window.dispatchEvent(new Event("storage"));

        // Redirect and refresh
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
      <section className="ec-page-content section-space-p">
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
                  <button className="btn btn-primary" type="submit">
                    Login
                  </button>
                  <Link to="/register">
                    <button className="btn btn-secondary">Register</button>
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
