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

      {/* Hero Section with gradient overlay */}
      <div
        className="about-hero-section"
        style={{
          background: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url("/assets/images/offer-image/1.jpg") center/cover no-repeat`,
          padding: "100px 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          {/* <h1 style={{ fontWeight: "800", fontSize: "48px" }}>{getTitle()}</h1> */}
          <p style={{ fontSize: "18px", opacity: 0.9 }}>
            Learn more about our journey and who we are.
          </p>
        </div>
      </div>

      {/* Main Content Section with glassmorphism */}
      <section className="py-5" >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="about-content-wrapper p-5"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* <h2 className="mb-4" style={{ fontWeight: "700" }}>
                  {getTitle()}
                </h2> */}
                <p className="text-muted mb-4 fw-bold" style={{ fontSize: "25px", }}>About our business firm</p>
                {aboutData ? (
                  <div
                    style={{ lineHeight: "1.8", fontSize: "14px", color: "#333", textAlign: "justify" }}
                    dangerouslySetInnerHTML={{ __html: getContent() }}
                  />
                ) : (
                  <p style={{ color: "#888" }}>Loading content...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
