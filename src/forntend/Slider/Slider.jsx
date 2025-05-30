import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import BannerServices from "../../services/homesliderservices ";

const Slider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await BannerServices.getBanner();
        const allBanners = response.data;

        // Filter only banners with status === 'Active'
        const activeBanners = allBanners.filter(banner => banner.status === "Active");

        setBanners(activeBanners); // ✅ Only set active banners
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);


  return (
    <div className="slider-container">
      {loading ? (
        <p>Loading banners...</p>
      ) : banners.length > 0 ? (
        <Carousel
          autoPlay
          interval={2000} // Faster slide change (3 seconds)
          transitionTime={500} // Faster transition (0.5 seconds)
          infiniteLoop
          showThumbs={false}
          showArrows={true}
          showStatus={false}
          dynamicHeight
        >
          {banners.map((banner, index) => (
            <div key={index} className="slider-item">
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${banner.image}`}
                alt={banner.title || `Banner ${index + 1}`}
                className="slider-image"
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <p>No banners available.</p>
      )}
    </div>
  );
};

export default Slider;
