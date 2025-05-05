import "./signUp.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminServices from "../../services/adminServices";
const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Restrict `mobileNo` and `pincode` to numbers only
    if ((name === "mobileNo" || name === "pincode") && !/^\d*$/.test(value)) {
      return;
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formValues.name ||
      !formValues.email ||
      !formValues.mobileNo ||
      !formValues.password
    ) {
      setError("Name, Email, Mobile Number, and Password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await AdminServices.createAdmin(formValues);
      console.log("API Response:", response); // Debugging API response

      if (response?.status) {
        // Ensure API returns a success status
        // Store authentication token if provided
        if (response?.token) {
          localStorage.setItem("authToken", response.token);
        }

        alert("Registration successful! Login it");
        navigate("/"); //
      } else {
        setError(response?.error || "Registration failed.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(error?.response?.data?.error || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <h2>Admin Registration</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formValues.name}
          onChange={handleInputChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleInputChange}
          required
        />
        <label>MobileNo</label>
        <input
          type="text"
          name="mobileNo"
          placeholder="Mobile Number"
          value={formValues.mobileNo}
          onChange={handleInputChange}
          required
          maxLength="10"
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formValues.password}
          onChange={handleInputChange}
          required
        />
        <label>Address</label>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formValues.address}
          onChange={handleInputChange}
        />
        <label>City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formValues.city}
          onChange={handleInputChange}
        />
        <label>State</label>
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formValues.state}
          onChange={handleInputChange}
        />
        <label>Pincode</label>
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formValues.pincode}
          onChange={handleInputChange}
          maxLength="6"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/admin/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignUp;
