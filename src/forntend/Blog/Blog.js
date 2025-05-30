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
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await BlogServices.getblog();

        // ✅ Filter blogs with status "Active"
        const activeBlogs = response.data.filter(blog => blog.status === "Active");

        console.log("Fetched Active Blogs:", activeBlogs);
        setBlogs(activeBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <HomeHeader />

      <div className="sticky-header-next-sec ec-breadcrumb section-space-mb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row ec_breadcrumb_inner p-3">
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

      <section className="ec-page-content section-space-p">
        <div className="container">
          <div className="row">
            <div className="ec-blogs-rightside col-lg-12 col-md-12">
              <div className="ec-blogs-content">
                <div className="ec-blogs-innerpl-4">
                  <div className="row">
                    {loading ? (
                      <p>Loading blogs...</p>
                    ) : currentBlogs.length > 0 ? (
                      currentBlogs.map((blog) => (
                        <div key={blog._id} className="col-lg-4 col-md-6 col-sm-12 mb-6 ec-blog-block" >
                          <div className="ec-blog-inner pt-4 pb-4"  >
                            <div className="ec-blog-image" style={{ width: '100%', maxHeight: '250px', overflow: 'hidden' }}>
                              <img
                                className="blog-image"
                                src={`${process.env.REACT_APP_API_BASE_URL}/${blog?.image}`}
                                alt={blog.title || "Blog Image"}
                                onError={(e) => (e.target.src = "/assets/images/default-blog.jpg")}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',

                                }}
                              />
                            </div>

                            <div className="ec-blog-content" >
                              <h5 className="ec-blog-title">{blog.title}</h5>
                              <div className="ec-blog-date">
                                By <span>{blog.author}</span> Date:{" "}
                                {new Date(blog.createdAt).toLocaleString()}
                              </div>
                              <div
                                className="ec-blog-desc"
                                style={{
                                  overflow: 'visible',
                                  maxHeight: 'none',
                                  textOverflow: 'unset',
                                  whiteSpace: 'normal',
                                  lineHeight: '1.6',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {blog.content.substring(0, 200)}...
                              </div>

                              <div className="ec-blog-btn">
                                <Link
                                  to={`/blog/${btoa(blog._id)
                                    .replace(/\//g, "_")
                                    .replace(/\+/g, "-")}`}
                                  className="btn" style={{ background: 'linear-gradient(to right,rgb(233, 115, 181),rgb(241, 82, 135))' }}
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

                  {/* Pagination Controls */}
                  {/* {!loading && totalPages > 1 && (
                    <div className="pagination mt-4 d-flex justify-content-center">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          className={`btn btn-sm mx-1 ${
                            currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
                          }`}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )} */}
                  {!loading && totalPages > 1 && (
                    <div className="pagination mt-4 d-flex justify-content-center align-items-center">
                      <button
                        className="btn btn-sm mx-1"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ⬅ Prev
                      </button>

                      {Array.from({ length: totalPages })
                        .slice(
                          Math.max(0, currentPage - 3),
                          Math.min(totalPages, currentPage + 2)
                        )
                        .map((_, index, arr) => {
                          const pageNumber = Math.max(1, currentPage - 2) + index;
                          return (
                            <button
                              key={pageNumber}
                              className={`btn btn-sm mx-1 ${currentPage === pageNumber ? "btn-primary" : "btn-outline-primary"
                                }`}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}

                      <button
                        className="btn btn-sm mx-1"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next ➡
                      </button>
                    </div>
                  )}

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
