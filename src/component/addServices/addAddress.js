import { Link, useNavigate } from "react-router-dom";
import Pagetitle from "../viewmodel/pagetitle";
import React, { useState,useEffect} from "react";
import AddressServices from "../../services/adressServices";
import UserAdressServices from "../../services/userservices"
function AddUserAdress() {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [formValues, setFormValues] = useState({
        street: "",
        city: "",
        state:"",
        postalCode:"",
        country:"",
        address:"",
        user:""
    });
      // Fetch categories on component mount
      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await UserAdressServices.getuser(); // Ensure API is correct
            setUserList(response.data);
          } catch (error) {
            console.error("Failed to fetch users", error);
          }
        };
        fetchUsers();
      }, []);
  

  
    // Handle form input changes
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormValues({
        ...formValues,
        [name]: value,
      });
    };
    const handleUserChange = (event) => {
      const selectedUser = userList.find((u) => u._id === event.target.value);
      if (selectedUser) {
        setFormValues({
          ...formValues,
          user: selectedUser._id, // Set user ID properly
          username: selectedUser.username || selectedUser.name, // Use correct username field
        });
      }
    };
 
  
    //   // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const requestData = { ...formValues };  // Convert form state to JSON
          console.log("Submitting Data:", requestData); // ✅ Log before sending
      
          const response = await AddressServices.createAddress(requestData);
          console.log("Response:", response.data); // ✅ Log response
      
          alert("Address created successfully");
          navigate("/user-address");
        } catch (error) {
          console.error("Failed to create Address:", error.response?.data || error);
          alert("Failed to create Address");
        }
      };
  
    return (
      <>
        <div className="right_col" role="main">
          <Pagetitle></Pagetitle>
          <div className="container-box">
            <div className="container-box-top-header justify-content-end">
              <div className="sub-title-box-right">
                <Link className="site-btn-green me-4" to="/user-address">
                  User Address List
                </Link>
              </div>
            </div>
            <div className="container-box-inner px-4">
              <div className="page-details">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                  <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">user*</label>
                        <select
                        className="form-control"
                        name="user"
                        value={formValues.user}
                        onChange={handleUserChange}
                        required
                      >
                        <option value="">Select User</option>
                        {userList.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.username || u.name}
                          </option>
                        ))}
                      </select>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">street*</label>
                        <input
                          type="text"
                          name="street"
                          value={formValues.street}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter street"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">city*</label>
                        <input
                          type="text"
                          name="city"
                          value={formValues.city}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter city"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">state*</label>
                        <input
                          type="text"
                          name="state"
                          value={formValues.state}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter state"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">postalCode*</label>
                        <input
                          type="Number"
                          name="postalCode"
                          value={formValues.postalCode}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter postalCode"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">country*</label>
                        <input
                          type="text"
                          name="country"
                          value={formValues.country}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter country"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div className="input-field">
                        <label className="pt-3">address*</label>
                        <input
                          type="text"
                          name="address"
                          value={formValues.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter address"
                          className="form-control"
                        />
                      </div>
                    </div>
                   
                  </div>
                  <button className="sited-btn">SUBMIT</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default AddUserAdress;
