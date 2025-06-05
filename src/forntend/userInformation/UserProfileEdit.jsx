import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserServices from "../../services/userservices";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { toast } from "react-toastify";

const UserProfileEdit = () => {
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName:"",
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
      setImagePreview(userData.image || null);
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
    if (!/^\d{6}$/.test(editUser.pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }

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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">Edit Profile</h4>
                <div className="text-center mb-4">
                  <img
                    src={
                      imagePreview
                        ? imagePreview.startsWith("blob:")
                          ? imagePreview
                          : `${process.env.REACT_APP_API_BASE_URL}/${imagePreview}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="rounded-circle shadow"
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      transition: "0.3s",
                    }}
                  />
                  <div className="mt-3">
                    <input
                      type="file"
                      className="form-control pt-3"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <form onSubmit={handleUpdate}>
                  <div className="row g-3">
                    {[
                      { label: "First Name", key: "firstName" },
                       { label: "Last Name", key: "lastName" },
                      { label: "Email", key: "email" },
                      { label: "Mobile Number", key: "mobileNo" },
                      { label: "Address", key: "address" },
                      { label: "City", key: "city" },
                      { label: "State", key: "state" },
                      { label: "Pincode", key: "pincode" },
                    ].map(({ label, key }) => (
                      <div className="col-12" key={key}>
                        <label className="form-label">{label}</label>
                        {label === "Pincode" ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editUser.pincode}
                            maxLength={6}
                            onChange={(e) => {
                              const val = e.target.value;
                              // Allow only digits and max length 6
                              if (/^\d{0,6}$/.test(val)) {
                                setEditUser({ ...editUser, pincode: val });
                              }
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            value={editUser[key]}
                            onChange={(e) =>
                              setEditUser({ ...editUser, [key]: e.target.value })
                            }
                          />
                        )}

                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn  w-80" style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))' }}>
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfileEdit;
