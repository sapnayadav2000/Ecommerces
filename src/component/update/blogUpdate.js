import React, { useState, useEffect } from "react";
import BlogServices from "../../services/blogServices";

function BlogUpdate({ blog, onSuccess, closeModal }) {
  const [formValues, setFormValues] = useState({
    title: "",
    content:"",
    author:"",
    tags:"",
    image: "",
    views:""
  });

  useEffect(() => {
    if (blog) {
      setFormValues({
        title: blog?.title || "",
        content: blog?.content || "",
        author: blog?.author || "",
        tags: blog?.tags || "",
        views: blog?.views || "",
        image: blog?.image || "",
      });
      if (blog.image) {
        setPreviewImage(`${process.env.REACT_APP_API_BASE_URL}/${blog.image}`);
      }
    }
  }, [blog]);

  const [previewImage, setPreviewImage] = useState("img/placeholder-img.png"); // Placeholder image path

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (const key in formValues) {
        if (key !== "image" || formValues[key] instanceof File) {
          formData.append(key, formValues[key]);
        }
      }

      await BlogServices.updateblog(blog._id, formData);
      alert(" updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      alert("Failed to update ");
    }
  };

  return (
    <div
      className="modal fade edit-box show d-block"
      id="editModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Blog</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={closeModal}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="container-box px-5">
              <div className="container-box-inner">
                <div className="page-details">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Title</label>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={formValues.title}
                            onChange={handleInputChange}
                            placeholder="Enter blog title"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Content</label>
                          <input
                            type="text"
                            name="content"
                            className="form-control"
                            value={formValues.content}
                            onChange={handleInputChange}
                            placeholder="Enter blog content"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Author</label>
                          <input
                            type="text"
                            name="author"
                            className="form-control"
                            value={formValues.author}
                            onChange={handleInputChange}
                            placeholder="Enter blog author"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">tags</label>
                          <input
                            type="text"
                            name="tags"
                            className="form-control"
                            value={formValues.tags}
                            onChange={handleInputChange}
                            placeholder="Enter blog tags"
                          />
                        </div>
                      </div>
                      <div className="col-sm-5">
                        <div className="input-field">
                          <label className="pt-3">Views</label>
                          <input
                            type="text"
                            name="views"
                            className="form-control"
                            value={formValues.views}
                            onChange={handleInputChange}
                            placeholder="Enter blog tags"
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="input-field">
                          <label className="pt-3"> 
                            Upload<span className="red">*</span>
                          </label>
                          <input
                            type="file"
                            name="image"
                            className="form-control"
                            onChange={handleFileChange}
                          />

                          <div className="file-preview text-center">
                            <img
                              id="uploadFile"
                              src={previewImage}
                              alt="your image"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="sited-btn-green">Update</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogUpdate;
