import React, { useState } from "react";
import Pagetitle from "../viewmodel/pagetitle";
import BlogService from "../../services/blogServices";
import { Link, useNavigate } from "react-router-dom";
function AddBlog() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
    image: "",
    views: ""

  });

  const [previewImage, setPreviewImage] = useState("img/placeholder-img.svg"); // Placeholder image path

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormValues({
        ...formValues,
        image: file,
      });
    }
  };

  //   // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }
      await BlogService.createblog(formData);
      alert("Blog created successfully");

      navigate("/blog");
    } catch (error) {
      console.error("Failed to create  blog", error);
      alert("Failed to create  blog");
    }
  };

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle></Pagetitle>
        <div className="container-box">
          <div className="container-box-top-header justify-content-end px-4">
            <div className="sub-title-box-right">
              <Link className="site-btn-green " to="/blog">
                <i className="fa fa-arrow-left mr-2"></i> Blog List
              </Link>
            </div>
          </div>
          <div className="container-box-inner px-4">
            <div className="page-details">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={formValues.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter title"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Content*</label>
                      <input
                        type="text"
                        name="content"
                        value={formValues.content}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Content"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Author*</label>
                      <input
                        type="text"
                        name="author"
                        value={formValues.author}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Author"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Tags</label>
                      <input
                        type="text"
                        name="tags"
                        value={formValues.tags}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Tags"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Views</label>
                      <input
                        type="number"
                        name="views"
                        value={formValues.views}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Views"
                        className="form-control"
                      />
                    </div>
                  </div>




                  <div className="col-lg-6 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">
                        Upload Image<small>(Size should be 343 x 160)</small>
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="form-control"
                        required
                      />
                      <div className="file-preview">
                        <img id="uploadFile" src={previewImage} alt=" " />
                      </div>
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

export default AddBlog;
