import Pagetitle from "./pagetitle";
import useAsync from '../../Hooks/useAsync';
import React, { useState, useEffect } from "react";
import UserServices from '../../services/appPolicyServices';
const AboutUs = () => {
  const { data, error, isLoading } = useAsync(UserServices.getabout);
  const [formValues, setFormValues] = useState({
    about: '',

    data: "about"
  });

  useEffect(() => {
    if (data) {
      setFormValues({
        about: data?.data?.English || '',

        data: "about"
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
      alert('about us updated successfully!');
    } catch (error) {
      console.error('Failed to update about us  :', error);
      alert('Failed to update about us . Please try again.');
    }
  };
  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box p-4 profile-container ">
          <div className="container-box-inner ">
            <div className="row">
              <form onSubmit={handleSubmit}>
                <div className="input-field">
                  <label ><b>English</b></label>
                  <textarea
                    type="text"
                    name="aboutUs"
                    rows={3}
                    value={formValues.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}

                    className="form-control"
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

export default AboutUs