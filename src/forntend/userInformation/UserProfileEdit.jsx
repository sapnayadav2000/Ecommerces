import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserServices from "../../services/userservices";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { toast } from "react-toastify";
const UserProfileEdit = () => {
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    mobileNo: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setEditUser(userData);
      setImagePreview(userData.image || null); // Set the existing image if available
    } else {
      navigate("/login");
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setEditUser({ ...editUser, image: file });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const formData = new FormData();
      for (const key in editUser) {
        formData.append(key, editUser[key]);
      }

      const response = await UserServices.UpdatedUser(userId, formData);
      if (response.status) {
        toast.success("Profile updated successfully");
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/user-profile");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update error", error);
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="container mt-5 mb-5">
        <h3 className="text-center ">Edit Profile</h3>
        <form onSubmit={handleUpdate} className="col-md-6 offset-md-3">
          <div className="mb-3 ">
            <div className="text-center">
              <img
                src={
                  `${process.env.REACT_APP_API_BASE_URL}/${imagePreview}
                 ` || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: "150px", height: "150px" }}
              />
            </div>
            <label className="form-label mt-4">Profile Image</label>
            <input
              type="file"
              className="form-control mt-2"
              onChange={handleImageChange}
            />
          </div>

          {[
            "name",
            "email",
            "mobileNo",
            "address",
            "city",
            "state",
            "pincode",
          ].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                className="form-control"
                value={editUser[field]}
                onChange={(e) =>
                  setEditUser({ ...editUser, [field]: e.target.value })
                }
              />
            </div>
          ))}
          <button type="submit" className="btn btn-success w-100">
            Update Profile
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UserProfileEdit;
