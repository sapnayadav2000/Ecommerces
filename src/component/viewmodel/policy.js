import React, { useState, useEffect } from "react";
import Pagetitle from "./pagetitle";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAsync from '../../Hooks/useAsync';

import UserServices from '../../services/appPolicyServices';
const Policy = () => {
  const { data, error, isLoading } = useAsync(UserServices.getPrivicyPolicy);
  const [formValues, setFormValues] = useState({
    privacyPolicy: '',
    privacyPolicyTitle: '',

    data: "privacyPolicy"
  });

  useEffect(() => {
    if (data) {
      setFormValues({
        privacyPolicyTitle: data?.data?.Title || '',
        privacyPolicy: data?.data?.English || '',

        data: "privacyPolicy"
      });
    }
  }, [data]);

  const handleInputChange = (name, value) => {
    setFormValues(prevValues => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserServices.updateAppPolicy(formValues);
      console.log(res);
      alert('Privacy Policy updated successfully!');
    } catch (error) {
      console.error('Failed to update Privacy Policy :', error);
      alert('Failed to update Privacy Policy . Please try again.');
    }
  };
  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box p-4 profile-container">
          <div className="container-box-inner">
            <div className="row page-details">
              <form onSubmit={handleSubmit}>
                <div className="input-field">
                  <label >Tittle </label>
                  <input type="text" name="title"
                    placeholder='Enter Title'
                    value={formValues.privacyPolicyTitle}
                    onChange={(e) => handleInputChange('privacyPolicyTitle', e.target.value)} className="form-control" />
                </div>

                <div className="input-field">
                  <label style={{ paddingTop: '40px' }}>Description </label>
                  <ReactQuill
                    theme="snow"
                    value={formValues.privacyPolicy}
                    onChange={(value) => handleInputChange('privacyPolicy', value)}

                  />
                </div>

                <button className="sited-btn-green">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Policy