import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import BlogServices from "../../services/blogServices";
import { Link } from "react-router-dom";
import CryptoJS from "crypto-js";
export default function Blogs() {
  const secretKey = "mySecretKey"; // Use a strong secret key

  const encryptId = (id) => {
    return CryptoJS.AES.encrypt(id, secretKey).toString(); // Encrypt blogId
  };
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await BlogServices.getblog();
        console.log("Fetched Blogs:", response.data);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);
  return (
    <div>
      <HomeHeader />
      <div className="sticky-header-next-sec ec-breadcrumb section-space-mb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row ec_breadcrumb_inner">
                <div className="col-md-6 col-sm-12">
                  <h2 className="ec-breadcrumb-title">Blog Page</h2>
                </div>
                <div className="col-md-6 col-sm-12">
                  <ul className="ec-breadcrumb-list">
                    <li className="ec-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="ec-breadcrumb-item active">Blog Page</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="ec-page-content section-space-p ">
        <div className="container ">
          <div className="row">
            <div className="ec-blogs-rightside col-lg-12 col-md-12 ">
              <div className="ec-blogs-content ">
                <div className="ec-blogs-innerpl-4">
                  <div className="row ">
                    {loading ? (
                      <p>Loading blogs...</p>
                    ) : blogs.length > 0 ? (
                      blogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="col-lg-4 col-md-6 col-sm-12 mb-6 ec-blog-block "
                        >
                          <div className="ec-blog-inner text-center pt-4 pb-4">
                            <div className="ec-blog-image">
                              <img
                                className="blog-image"
                                src={`${process.env.REACT_APP_API_BASE_URL}/${blog?.image}`}
                                alt={blog.title || "Blog Image"}
                                onError={(e) =>
                                  (e.target.src =
                                    "/assets/images/default-blog.jpg")
                                }
                              />
                            </div>
                            <div className="ec-blog-content">
                              <h5 className="ec-blog-title">{blog.title}</h5>
                              <div className="ec-blog-date">
                                By <span>{blog.author}</span> Date :
                                {new Date(blog.createdAt).toLocaleString()}
                              </div>
                              <div className="ec-blog-desc">
                                {blog.content.substring(0, 100)}...
                              </div>
                              <div className="ec-blog-btn">
                                <Link
                                  to={`/blog/${btoa(blog._id)
                                    .replace(/\//g, "_")
                                    .replace(/\+/g, "-")}`}
                                  className="btn btn-primary"
                                >
                                  Read More
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No blogs found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
