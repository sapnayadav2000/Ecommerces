import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogServices from "../../services/blogServices";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";

export default function BlogDetails() {
  const { encodedBlogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Store error messages
  const [blogId, setBlogId] = useState(null); // Store decoded blogId safely

  useEffect(() => {
    if (!encodedBlogId) {
      setError("Blog ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const decodedId = atob(encodedBlogId.replace(/_/g, "/").replace(/-/g, "+"));
      setBlogId(decodedId);
    } catch (err) {
      setError("Invalid blog ID format.");
      setLoading(false);
    }
  }, [encodedBlogId]); // Runs only when encodedBlogId changes

  useEffect(() => {
    if (!blogId || error) {
      setLoading(false);
      return;
    }

    const fetchBlogDetails = async () => {
      try {
        const response = await BlogServices.getBlogById(blogId);
        console.log("Blog Details:", response.data);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to fetch blog details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]); // Runs only when blogId changes

  // Conditional Rendering
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <HomeHeader />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div
            className="col-lg-8 col-md-10 col-sm-12 p-4 rounded shadow"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="d-flex flex-column flex-md-row align-items-center">
              {/* Image */}
              <img
                className="img-fluid mb-3 mb-md-0 rounded"
                src={`${process.env.REACT_APP_API_BASE_URL}/${blog.image}`}
                alt={blog.title}
                onError={(e) =>
                  (e.target.src = "/assets/images/default-blog.jpg")
                }
                style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
              />

              {/* Blog Content */}
              <div className="ms-md-4 text-center text-md-start">
                <h2>{blog.title}</h2>
                <p className="text-muted">
                  By <strong>{blog.author} Date :{new Date(blog.createdAt).toLocaleString()}</strong>
                </p>
                <p className="lead">{blog.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
