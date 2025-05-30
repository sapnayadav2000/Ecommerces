import React, { useState, useEffect } from 'react';
import Pagetitle from './pagetitle';
import useAsync from '../../Hooks/useAsync';

import UserServices from '../../services/appPolicyServices';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function TermCondition() {
  const { data, error, isLoading } = useAsync(UserServices.getTermCondition);
  const [formValues, setFormValues] = useState({
    termsAndCondition: '',
    termsAndConditionTitle: '',


    data: "termCondition"
  });

  useEffect(() => {
    if (data) {
      setFormValues({
        termsAndConditionTitle: data?.data?.Title || '',

        termsAndCondition: data?.data?.English || '',

        data: "termsAndCondition"
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
      alert('Terms and Condition updated successfully!');
    } catch (error) {
      console.error('Failed to update Terms and Condition:', error);
      alert('Failed to update Terms and Condition. Please try again.');
    }
  };

  return (
    <div className="right_col" role="main">
      <Pagetitle />
      <div className="container-box p-4 profile-container">
        <div className="container-box-inner">
          <div className="row page-details">
            <form
              onSubmit={handleSubmit}
            >
              <div className="input-field">
                <label>Title (English)</label>
                <input
                  type="text"
                  name="title"
                  value={formValues.termsAndConditionTitle}
                  onChange={(e) => handleInputChange('termsAndConditionTitle', e.target.value)}
                  placeholder='Enter Title'
                  className="form-control"
                />
              </div>

              <div className="input-field mt-3">
                <label>Description </label>
                <ReactQuill className='mt-3'
                  theme="snow"
                  value={formValues.termsAndCondition}
                  onChange={(value) => handleInputChange('termsAndCondition', value)}
                />
              </div>

              <button className="sited-btn-green">SUBMIT</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermCondition;
