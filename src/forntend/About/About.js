import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import ApiService from "../../services/appPolicyServices";

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await ApiService.getabout();
        setAboutData(response?.data?.data || response?.data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAbout();
  }, []);

  const getTitle = () => aboutData?.Title || "About Us";

  const getContent = () => {
    const text = aboutData?.English || "";
    return text.replace(/\n/g, "<br />");
  };

  return (
    <>
      <HomeHeader />

      {/* Breadcrumb */}
      <div className="bg-light py-4 border-bottom text-center">
        <div className="container">
          <h2 className="fw-bold">{getTitle()}</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="ml-2 active" aria-current="page">
                {getTitle()}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Image */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="assets/images/offer-image/1.jpg"
                alt="About"
                className="img-fluid rounded shadow"
              />
            </div>

            {/* Right Content */}
            <div className="col-lg-6">
              <h3 className="mb-3 fw-bold">{getTitle()}</h3>
              <p className="text-muted">About our business firm</p>
              {aboutData ? (
                <div
                  className="text-dark"
                  style={{ lineHeight: "1.8", textAlign: "justify" }}
                  dangerouslySetInnerHTML={{ __html: getContent() }}
                />
              ) : (
                <p>Loading content...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
