import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Productservices from "../../services/productServices";

const Serach = () => {
  const [category_name, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const searchByCategory = async (e) => {
    e.preventDefault();
    if (!category_name) return;

    setLoading(true);
    try {
      const response = await Productservices.productsearch({ category_name });
      console.log("Full response:", response);

      // Check if response and response.category are defined before accessing category
      if (response && response.category) {
        console.log("Category found:", response.category);
        setSearchResults([response.category]); // Only set the category
      } else {
        console.log("No category found");
        setSearchResults([]); // No category found
      }
      setShowResults(true);
    } catch (error) {
      console.error("Error searching category:", error);
      setSearchResults([]); // Reset search results on error
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCategoryName(value);
    if (value === "") setShowResults(false); // Hide results when input is empty
  };

  const handleCategoryClick = (categoryId) => {
    // Navigate to the category page or any other action you need
    navigate(`/category/${categoryId}`);
    setCategoryName("");
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="ec-header-bottom d-none d-lg-block">
      <div className="container position-relative">
        <div className="row">
          <div className="header-bottom-flex">
            <div className="align-self-center ec-header-search custom-header">
              <div className="header-search">
                <form
                  className="ec-search-group-form"
                  onSubmit={searchByCategory}
                  style={{ width: "450px" }}
                >
                  <input
                    className="form-control"
                    placeholder="I'm searching for..."
                    type="text"
                    onChange={handleInputChange}
                    value={category_name}
                  />
                  <button type="submit" style={{ display: "none" }} />
                </form>

                {/* Results dropdown */}
                {showResults && (
                  <div
                    className="search-results-dropdown"
                    style={{
                      position: "absolute",
                      width: "100%",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      zIndex: 1000,
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    {loading ? (
                      <div
                        className="search-loading"
                        style={{ padding: "10px" }}
                      >
                        Loading...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul
                        className="search-results-list"
                        style={{ listStyle: "none", padding: 0, margin: 0 }}
                      >
                        {searchResults.map((category) => (
                          <li
                            key={category._id}
                            className="search-result-item"
                            style={{
                              padding: "10px",
                              borderBottom: "1px solid #eee",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handleCategoryClick(category._id)}
                          >
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                {category.name}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="no-results" style={{ padding: "10px" }}>
                        No categories found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Serach;
