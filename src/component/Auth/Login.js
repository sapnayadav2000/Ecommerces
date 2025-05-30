import { useState, useEffect } from "react";
import AdminServices from "../../services/adminServices";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const PasswordToggle = ({ password, setPassword }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="form-group">
      <label htmlFor="password" style={{ marginBottom: '10px' }}>
        <i className="fa fa-lock" />
      </label>
      <input
        type={passwordVisible ? 'text' : 'password'}
        className=""
        id="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <span
        id="togglePassword"
        className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}
        onClick={togglePasswordVisibility}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};

function Login({ setIsAuthenticated, setRole }) {
  const [mobileOrEmail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = Cookies.get("rememberEmail");
    const rememberedPassword = Cookies.get("rememberPassword");

    if (rememberedEmail) setEmail(rememberedEmail);
    if (rememberedPassword) setPassword(rememberedPassword);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await AdminServices.login({ mobileOrEmail, password });
      if (data?.status === true && data?.token) {
        localStorage.setItem("authToken", data?.token);

        // Decode token to get userType (Admin/User)
        const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
        localStorage.setItem("userRole", decodedToken.userType); // ← fixed line

        localStorage.setItem("name", data?.data?.name);
        localStorage.setItem("image", data?.data?.image);

        // Store permissions
        const permissions = {};
        data?.data?.permissions?.forEach((item) => {
          if (item?.menuItem && item?.roles) {
            permissions[item.menuItem] = item.roles?.[decodedToken.userType];
          }
        });
        localStorage.setItem("userPermissions", JSON.stringify(permissions));

        setIsAuthenticated(true);
        setRole(decodedToken.userType);

        // Redirect to dashboard
        setTimeout(() => navigate("/dashboard"), window.location.reload(), 0);
      } else {
        setError("*Invalid Credentials. Please check your email and password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("*Something went wrong. Please try again.");
    }
  };

  return (
    <div className="dashboard-body">
      <div className="login-container">
        <div className="login-left">
          <img
            src="/img/form1.jpg"
            alt="Login-bg"
            className="login-img"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px 0 0 10px' }}
          />
        </div>
        <div className="login-right">
          <form id="login-form" onSubmit={handleSubmit} method="post">
            <h2>Login</h2>
            <div className="form-group">
              <label htmlFor="username" className="icon-container">
                <i className="fa fa-envelope" />
              </label>
              <input
                type="email"
                className=""
                id="userEmail"
                placeholder="example@example.com"
                value={mobileOrEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <PasswordToggle password={password} setPassword={setPassword} />
            <div className="form-check" style={{ color: '#fff', marginBottom: '35px', marginTop: '-20px' }}>
              <input
                className="form-check-input mt-1 p-0"
                type="checkbox"
                defaultValue=""
                id="flexCheckChecked"
              />
              <label className="form-check-label " htmlFor="flexCheckChecked">
                Remember Password
              </label>
              <h6 style={{ color: 'red' }}>{error}</h6>
            </div>

            <div className="input-field mb-3">
              <input
                type="submit"
                className="login-btn"
                id="login-btn"
                value="Login"

              />
            </div>
            <p className="company-details font-sm" style={{ color: 'white', fontSize: '12px' }}>
              Software Design & Developed By :{' '}
              <a
                href="https://truevalueinfosoft.com/"
                target="_blank"
                style={{ color: '#fff' }}
              >
                True Value Infosoft
              </a>{' '}
              (P) Limited
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;








