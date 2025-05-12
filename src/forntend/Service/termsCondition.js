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

  const getTitle = () => {
    return TermConditionData?.Title || "Terms & Conditions";
  };

  const getContent = () => {
    const text = TermConditionData?.English || "";
    return text.replace(/\n/g, "<br />");
  };

  return (
    <>
      <HomeHeader />

      <div className="sticky-header-next-sec ec-breadcrumb section-space-mb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="row ec_breadcrumb_inner">
                <div className="col-md-6 col-sm-12">
                  <h2 className="ec-breadcrumb-title">Terms & Conditions</h2>
                </div>
                <div className="col-md-6 col-sm-12">
                  <ul className="ec-breadcrumb-list">
                    <li className="ec-breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="ec-breadcrumb-item active" aria-current="page">
                      Terms & Conditions
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
                      {getTitle()}
                    </h3>
                    {TermConditionData ? (
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

export default TermCondition;
