import Pagetitle from "./pagetitle";
import useAsync from "../../Hooks/useAsync";
import React, { useState,useEffect , useRef} from 'react';
import AdminServices from "../../services/adminServices";
function Profile() {
  const { data, error, isLoading ,run} = useAsync(AdminServices.getMyProfile);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formValues,setFormValues]=useState({
    name:"",
    address:"",
    city:"",
    state:"",
    pincode:""
  })

  useEffect(() => {
    if (data) {
      setFormValues({
        name: data?.data?.name || '',
        address: data?.data?.address || '',
        city: data?.data?.city || '',
        state: data?.data?.state || '',
        pincode: data?.data?.pincode || '',
      
      });
      
      if (data?.data?.image) {
        setPreviewUrl(data.data.image);// If profile image URL exists in data
      }
    }
  }, [data]);
  const [formValues2, setFormValues2] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  setSelectedFile(file);
  setPreviewUrl(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await AdminServices.updateMe(formData); // Assuming updateProfileImage is a method in AdminServices
    alert('Profile image updated successfully');
    console.log(res);
    localStorage.setItem('image', res?.data?.image);
    run();
  } catch (error) {
    console.error('Failed to update profile image', error);
    alert('Failed to update profile image');
  }
};

  

  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    setFormValues2({
      ...formValues2,
      [name]: value,
    });
  };
  const handleInputChange1 = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formValues);
      await AdminServices.updateMe(formValues);
      alert('Admin details updated successfully');
    } catch (error) {
      console.error('Failed to update Admin details', error);
      alert('Failed to update Admin details');
    }
  };


  const handleSubmit2 = async (event) => {
    event.preventDefault();
    try {
      if (formValues2.newPassword !== formValues2.confirmPassword) {

        alert('New password and confirm password do not match');
      } else if (formValues2.oldPassword === formValues2.newPassword) {
        alert('New password cannot be the same as the old password');
      } else {
        console.log("klfjkl",formValues2)
        await AdminServices.updatePassword(formValues2);
        alert('Password updated successfully');
      }
    } catch (error) {
      console.error('Failed to update password', error);
      alert('Failed to update password ');
    }
  };


  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box p-0 profile-container py-0">
          <div
            className="profile-header"
            style={{ backgroundColor: "#dcf6e6" }}
          >
            <div className="profile-img-outer">
           
            <img src= {`${process.env.REACT_APP_API_BASE_URL}/${previewUrl}`} alt="Profile" />
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <button className="profile-upload-btn" onClick={() => fileInputRef.current.click()}>
                <i className="fa fa-pencil" />
              </button>
            </div>
          </div>
          <div className="container-box-inner p-5 mt-5">
            <div className="row">
            <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">User Details</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange1}
                    className="form-control"
                    placeholder="Enter name"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formValues.address}
                    onChange={handleInputChange1}
                    className="form-control"
                    placeholder="Enter address"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formValues.city}
                    onChange={handleInputChange1}
                    className="form-control"
                    placeholder="Enter city"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formValues.state}
                    onChange={handleInputChange1}
                    className="form-control"
                    placeholder="Enter state"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formValues.pincode}
                    onChange={handleInputChange1}
                    className="form-control"
                    placeholder="Enter pincode"
                  />
                </div>
                <button className="btn btn-secondary w-100">Submit</button>
              </form>
            </div>
          </div>
        </div>
              <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Change Your Password</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit2}>
                <div className="mb-3">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formValues2.oldPassword}
                    onChange={handleInputChange2}
                    className="form-control"
                    placeholder="Enter old password"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formValues2.newPassword}
                    onChange={handleInputChange2}
                    className="form-control"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formValues2.confirmPassword}
                    onChange={handleInputChange2}
                    className="form-control"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="btn btn-info w-100">Save Changes</button>
        
                  </form>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
