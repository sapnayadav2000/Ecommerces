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

  const getContent = () => {
    const text = privacyPolicyData?.English;
    return text?.replace(/\n/g, "<br />");
  };

  return (
    <>
      <HomeHeader />

      <div className="sticky-header-next-sec ec-breadcrumb section-space-mb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row ec_breadcrumb_inner p-3">
                <div className="col-md-6 col-sm-12">
                  <h2 className="ec-breadcrumb-title">Privacy Policy</h2>
                </div>
                <div className="col-md-6 col-sm-12">
                  <ul className="ec-breadcrumb-list">
                    <li className="ec-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="ec-breadcrumb-item active">
                      Privacy Policy
                    </li>
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
            <div className="col-md-12 text-center">
              <div className="section-title">
                <p className="sub-title mb-3">About our business firm</p>
              </div>
            </div>

            <div className="ec-common-wrapper">
              <div className="row">
                <div className="col-md-6 ec-cms-block ec-abcms-block text-center">
                  <div className="ec-cms-block-inner">
                    <img
                      className="a-img"
                      src="assets/images/offer-image/1.jpg"
                      alt="about"
                    />
                  </div>
                </div>

                <div className="col-md-6 ec-cms-block ec-abcms-block text-center">
                  <div className="ec-cms-block-inner">
                    <h3
                      className="ec-cms-block-title mt-4"
                      style={{ fontSize: "15px" }}
                    >
                      {privacyPolicyData?.Title}
                    </h3>
                    {privacyPolicyData ? (
                      <div
                        style={{ textAlign: "left" }}
                        dangerouslySetInnerHTML={{ __html: getContent() }}
                      />
                    ) : (
                      <p>Loading content...</p>
                    )}
                  </div>
                </div>
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
