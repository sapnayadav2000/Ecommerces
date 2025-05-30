import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import CategoryServices from "../../services/categoryServices";

const HomeCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await CategoryServices.getCategory();
        const allCategories = response.data;

        // Filter to only active categories
        const activeCategories = allCategories.filter(cat => cat.status === "Active");

        setCategories(activeCategories);
      } catch (error) {
        console.error("Failed to fetch Category", error);
      }
    };
    getCategory();
  }, []);


  const handleSubCategoryClick = (subCategoryId, subCategorySlug) => {
    // Navigate to product list with subcategory ID
    navigate(`/subcategory/${subCategorySlug || subCategoryId}`, {
      state: { subCategoryId },
    });
  };
  const encodeId = (id) => {
    return btoa(id).replace(/\+/g, "-").replace(/\//g, "_");
  };

  return (
    <section className="section ec-category-section section-space-p mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-12 section-title-block">
            <div className="section-title">
              <h2 className="ec-title">Browse By Categories</h2>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="ec_cat_slider">
            <Slider {...sliderSettings}>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div className="ec_cat_content" key={category._id}>
                    <div
                      className="ec_cat_inner"
                      style={{ paddingTop: "30px" }}
                    >
                      <div
                        className="ec-cat-image"
                        style={{ display: "flex", cursor: "pointer" }}
                        onClick={() =>
                          handleSubCategoryClick(category._id, category.slug)
                        }
                      >
                        <img
                          src={`${process.env.REACT_APP_API_BASE_URL}/${category.image}`}
                          alt={category.name}
                        />
                      </div>
                      <div className="ec-cat-desc">
                        <span
                          className="ec-section-btn"
                          onClick={() =>
                            handleSubCategoryClick(category._id, category.slug)
                          }
                          style={{ cursor: "pointer", color: 'rgb(193, 38, 97)' }}
                        >
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No categories found.</div>
              )}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCategory;
