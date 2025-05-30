import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import TermConditions from "../../services/appPolicyServices";

const TermCondition = () => {
  const [TermConditionData, setTermConditionData] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await TermConditions.getTermCondition();
        setTermConditionData(response?.data?.data || response?.data);
      } catch (error) {
        console.error("Error fetching term condition data:", error);
      }
    };

    fetchTerms();
  }, []);

  const getTitle = () => TermConditionData?.Title || "Terms & Conditions";

  const getContent = () => {
    const text = TermConditionData?.English || "";
    return text.replace(/\n/g, "<br />");
  };

  return (
    <>
      <HomeHeader />

      {/* Hero Section with overlay */}
      <div
        className="terms-hero-section"
        style={{
          background: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url("/assets/images/offer-image/1.jpg") center/cover no-repeat`,
          padding: "100px 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h1 style={{ fontWeight: "800", fontSize: "48px", color: "#fff" }}>{getTitle()}</h1>
          <p style={{ fontSize: "18px", opacity: 0.9 }}>
            Understanding the rules — your guide to terms and conditions.
          </p>
        </div>
      </div>

      {/* Content Section with glassmorphism */}
      <section className="py-5" >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="terms-content-wrapper p-5"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
                  color: "#333",
                }}
              >
                <h2 className="mb-4" style={{ fontWeight: "700" }}>
                  {getTitle()}
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: "20px", }}>About our business firm</p>
                {TermConditionData ? (
                  <div
                    style={{ lineHeight: "1.8", fontSize: "16px", textAlign: "justify" }}
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

export default TermCondition;
