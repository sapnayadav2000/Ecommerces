import React, { useState } from "react";
import HomeHeader from "../HomeHeader";
import "./UserRegister.css";
import { ToastContainer, toast } from "react-toastify";
import UserServices from "../../services/userservices";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [code, setCode] = useState("");

  const userData = {
    firstName,
    lastName,
    email,
    mobileNo,
    password,
    pincode,
    address,
    city,
    state,
  };

  const [token, setToken] = useState(null); // new state

  const handleSubmit = async (event) => {
    event.preventDefault();
    const mobile = mobileNo ? mobileNo.trim() : "";

    if (!/^\d{6}$/.test(pincode)) {
      alert("Pincode must be exactly 6 digits.");

      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      alert("Pincode must be exactly 10 digits.");

      return;
    }

    try {
      const response = await UserServices.getRegister(userData);
      setData(response.data);
      setToken(response.data.token); // ✅ Save token here
      console.log("OTP Response Data:", response.data);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError(err.response ? err.response.data : err.message);
      toast.error("Registration failed.");
    }
  };

  const verifyOtp = async () => {
    try {
      console.log("Verifying with OTP:", code, "and token:", token);
      const res = await UserServices.verifyOtp({
        otp: code,
        tokenOfUser: token,
      }); // ✅ FIXED
      toast.success("OTP verified successfully!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data || error.message || "Unknown error";
      toast.error(`Verification failed: ${errorMessage.error || errorMessage}`);
      console.error("Verification Error:", errorMessage);
    }
  };

  return (
    <>
      <HomeHeader />
      <section className="ec-page-content section-space-p mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <div className="section-title">
                <h2 className="ec-title">Register</h2>
                <p className="sub-title">
                  Best place to buy and sell digital products
                </p>
              </div>
            </div>
            <div className="ec-register-wrapper mt-3">
              <div className="ec-register-container">
                <div className="ec-register-form">
                  {!data?.otpCode ? (
                    <form onSubmit={handleSubmit}>
                      <span className="ec-register-wrap ec-register-half">
                        <label>First Name*</label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={firstName}
                          onChange={(e) => setfirstName(e.target.value)}
                          required
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>Last Name*</label>
                        <input
                          type="text"
                          placeholder="Enter your name"
                          value={lastName}
                          onChange={(e) => setlastName(e.target.value)}
                          required
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>Email*</label>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>Mobile Number*</label>
                        <input
                          type="text"
                          placeholder="Enter your phone number"
                          value={mobileNo}
                          onChange={(e) => setMobileNo(e.target.value)}
                          required
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>Password</label>
                        <input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>PinCode</label>
                        <input
                          type="number"
                          placeholder="Enter your pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          maxLength={6}  // max 6 characters
                          pattern="\d{6}"
                          required
                        />
                      </span>
                      <span className="ec-register-wrap">
                        <label>Address</label>
                        <input
                          type="text"
                          placeholder="Address Line 1"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>City*</label>
                        <input
                          type="text"
                          placeholder="Enter your city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </span>
                      <span className="ec-register-wrap ec-register-half">
                        <label>State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </span>

                      <span className="ec-register-wrap ec-register-btn">
                        <button className="btn btn-primary" type="submit">
                          Send OTP
                        </button>
                        <ToastContainer />
                      </span>
                    </form>
                  ) : (
                    <div className="otp-verification mt-4">
                      <h3>Enter OTP</h3>
                      <p>
                        Your OTP is: <strong>{data.otpCode}</strong>
                      </p>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="form-control mb-2"
                      />
                      <button className="btn btn-dark" onClick={verifyOtp}>
                        Verify OTP
                      </button>
                      <ToastContainer />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserRegister;
