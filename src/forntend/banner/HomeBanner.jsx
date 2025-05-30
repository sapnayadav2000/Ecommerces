import BannerServices from "../../services/homesliderservices ";
import React, { useEffect, useState } from "react";

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await BannerServices.getBanner();
        const allBanners = response.data;




        setBanners(allBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Show the last available banner (or change logic as needed)
  const lastBanner = banners[banners.length - 3];

  return (
    <section className="ec-banner section">
      <h2 className="d-none">Banner</h2>
      <div className="ec-banners">
        <div className="ec-banner-right col-sm-12">
          <div className="ec-banner-block ec-banner-block-2 col-sm-12">
            <div className="banner-block">
              {loading ? (
                <p>Loading...</p>
              ) : lastBanner ? (
                <img
                  key={lastBanner._id}
                  src={`${process.env.REACT_APP_API_BASE_URL}/${lastBanner.image}`}
                  alt={lastBanner.title || "Banner"}
                  style={{ width: "100%", borderRadius: "10px" }}
                />
              ) : (
                <p>No active banners available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
