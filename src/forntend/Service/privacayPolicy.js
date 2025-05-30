import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import PrivacyPolicys from "../../services/appPolicyServices";

const PrivacyPolicy = () => {
  const [privacyPolicyData, setPrivacyPolicyData] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await PrivacyPolicys.getPrivicyPolicy();
        setPrivacyPolicyData(response?.data?.data || response?.data);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      }
    };

    fetchPolicy();
  }, []);

  return (
    <>
      <HomeHeader />

      {/* Unique Hero Section with overlay */}
      <div
        className="policy-hero-section"
        style={{
          background: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url("/assets/images/offer-image/1.jpg") center/cover no-repeat`,
          padding: "100px 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h1 style={{ fontWeight: "800", fontSize: "48px", color: "#fff" }}>Privacy Policy</h1>
          <p style={{ fontSize: "18px", opacity: 0.9 }}>
            Empowering transparency — how we handle your data with care.
          </p>
        </div>
      </div>

      {/* Policy Content with glassmorphism */}
      <section className="policy-content-section py-5" >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="policy-content-wrapper p-5"
                style={{
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h2 className="mb-4" style={{ fontWeight: "700" }}>
                  {privacyPolicyData?.Title || "Privacy Policy"}
                </h2>
                {privacyPolicyData ? (
                  <div
                    style={{ lineHeight: "1.8", fontSize: "16px", color: "#333" }}
                    dangerouslySetInnerHTML={{ __html: privacyPolicyData.English }}
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

export default PrivacyPolicy;
