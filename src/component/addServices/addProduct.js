import { Link, useNavigate } from "react-router-dom";
import Pagetitle from "../viewmodel/pagetitle";
import React, { useState, useEffect } from "react";
import Productservices from "../../services/productServices";
import CategoryServices from "../../services/categoryServices";
import SubCategoryServices from "../../services/addSubCategory";
import BrandService from "../../services/brandServices";
function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  console.log("subcategories--------", subcategories);

  const [formValues, setFormValues] = useState({
    name: "",
    images: [],
    description: "",
    Sortdescription: "",
    Originalprice: "",
    price: "",
    category: "",
    subCategory: "",
    brand: "",
    refundPolicies: {
      returnable: true, // true or false
      returnWindow: 0,   // number of days
    },
    productkey: [{
      Size: "",
      Quantity: "",
      OfferPrice: "",
    }],

  });

  const [previewimages, setPreviewimages] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryServices.getCategory(); // Adjust API call as needed
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await BrandService.getbrand(); // Adjust API call as needed
        setBrand(response.data);
      } catch (error) {
        console.error("Failed to fetch Brand", error);
      }
    };
    fetchBrand();
  }, []);

  const handleCategoryChange1 = async (event) => {
    const selectedCategoryId = event.target.value;
    setFormValues((prev) => ({
      ...prev,
      category: selectedCategoryId,
      subCategory: "",
    }));

    if (selectedCategoryId) {
      try {
        const response = await SubCategoryServices.getSubCategoryByCategory(
          selectedCategoryId
        );
        console.log("Fetched subcategories response:", response);

        // Ensure response is an array, even if it's null or undefined
        if (Array.isArray(response)) {
          console.log("Setting subcategories:", response);
          setSubCategories(response);
        } else {
          console.log("No subcategories found.");
          setSubCategories([]); // Reset if no valid subcategories
        }
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
        setSubCategories([]); // Reset on error
      }
    } else {
      setSubCategories([]); // Reset when category is unselected
    }
  };
  const handleRefundPolicyChange = (e) => {
    const { name, value } = e.target;

    if (name === "returnable") {
      // Convert the value to boolean correctly
      setFormValues((prev) => ({
        ...prev,
        refundPolicies: {
          ...prev.refundPolicies,
          [name]: value === "yes", // If "Yes" is selected, set to true
        },
      }));
    } else if (name === "returnWindow") {
      // Ensure returnWindow is a valid number
      setFormValues((prev) => ({
        ...prev,
        refundPolicies: {
          ...prev.refundPolicies,
          [name]: parseInt(value) || 0, // Ensure the value is a valid number or 0 if invalid
        },
      }));
    }
  };

  const handleSubCategoryChange1 = (event) => {
    setFormValues((prev) => ({ ...prev, subCategory: event.target.value }));
  };

  // Debugging log
  useEffect(() => {
    console.log("Updated subcategories state:", subcategories);
  }, [subcategories]);
  const handleCategoryChange2 = (event) => {
    const selectedBrand = brand.find(
      (brand) => brand._id === event.target.value
    );
    setFormValues({
      ...formValues,
      brand: selectedBrand._id,
      brandname: selectedBrand.name,
    });
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviewimages = files.map((file) => URL.createObjectURL(file));
    setPreviewimages([...previewimages, ...newPreviewimages]);
    setFormValues({ ...formValues, images: [...formValues.images, ...files] });
  };

  const handleDeleteimages = (index) => {
    const updatedimages = formValues.images.filter((_, i) => i !== index);
    const updatedPreviewimages = previewimages.filter((_, i) => i !== index);
    setFormValues({ ...formValues, images: updatedimages });
    setPreviewimages(updatedPreviewimages);
  };
  // Handle images selection

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      for (const key in formValues) {
        if (key === "images") {
          formValues.images.forEach((image) => {
            formData.append("images", image);
          });
        } else if (key === "productkey") {
          formData.append("productkey", JSON.stringify(formValues.productkey)); // ✅ Convert to JSON
        } else if (key === "refundPolicies") {
          // Add refund policies to form data
          formData.append("refundPolicies", JSON.stringify(formValues.refundPolicies)); // Convert to JSON
        } else {
          formData.append(key, formValues[key]);
        }
      }

      await Productservices.createproduct(formData);
      alert("Product created successfully");
      navigate("/product");
    } catch (error) {
      console.error("Failed to create Product ", error);
      alert("Failed to create product ");
    }
  };

  // Add size and quantity fields
  const handleChange = (index, field, value) => {
    const updatedproductkey = [...formValues.productkey];
    updatedproductkey[index][field] = value;
    setFormValues({
      ...formValues,
      productkey: updatedproductkey,
    });
  };
  const remove = (index) => {
    const updatedproductkey = formValues.productkey.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      productkey: updatedproductkey,
    });
  };
  const add = () => {
    setFormValues({
      ...formValues,
      productkey: [
        ...formValues.productkey,
        { Size: '', Quantity: '', OfferPrice: "" },
      ],
    });
  };

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle />
        <div className="container-box">
          <div className="container-box-top-header justify-content-end px-4">
            <div className="sub-title-box-right">
              <Link className="site-btn-green " to="/product">
                <i className="fa fa-arrow-left mr-2"></i> Product List
              </Link>
            </div>
          </div>
          <div className="container-box-inner px-4">
            <div className="page-details">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Category */}
                  <div className="col-lg-4 col-md-6 ">
                    <div className="input-field ">
                      <label className="pt-3">Category*</label>
                      <select
                        className=" form-select border"
                        onChange={handleCategoryChange1}
                        value={formValues.category}
                      >
                        <option value="">Select Category</option>
                        {categories
                          .filter(category => category.status && category.status.toLowerCase() === "active")
                          .map(category => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))
                        }

                      </select>
                    </div>
                  </div>
                  {/* Subcategory */}
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Subcategory*</label>
                      <select
                        className="form-select border"
                        onChange={handleSubCategoryChange1}
                        value={formValues.subCategory || ""}
                        disabled={!formValues.category || subcategories.length === 0}
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories && subcategories.length > 0 ? (
                          subcategories
                            .filter(subCategory => subCategory.status && subCategory.status.toLowerCase() === "active")
                            .map(subCategory => (
                              <option key={subCategory._id} value={subCategory._id}>
                                {subCategory.name}
                              </option>
                            ))
                        ) : (
                          <option disabled>No subcategories available</option>
                        )}
                      </select>


                    </div>
                  </div>
                  {/* brand */}
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Brand</label>
                      <select
                        className=" form-select border"
                        name="brand"
                        onChange={handleCategoryChange2}
                      >
                        <option value="">Select Brand</option>
                        {brand
                          .filter(b => b.status && b.status.toLowerCase() === "active")
                          .map((brand) => (
                            <option key={brand._id} value={brand._id}>
                              {brand.name}
                            </option>
                          ))}

                      </select>
                    </div>
                  </div>
                  {/* Name */}
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Name*</label>
                      <input
                        type="text"
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter product name"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Original Price*</label>
                      <input
                        type="number"
                        name="Originalprice"
                        value={formValues.Originalprice}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Originalprice"
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-lg-4 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Price*</label>
                      <input
                        type="number"
                        name="price"
                        value={formValues.price}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter price"
                        className="form-control"
                      />
                    </div>
                  </div>


                  {/* Description */}
                  <div className="col-md-12">
                    <div className="input-field">
                      <label className="pt-3">Description</label>
                      <textarea
                        name="description"
                        value={formValues.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter description"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="input-field">
                      <label className="pt-3">Sort Description</label>
                      <textarea
                        name="Sortdescription"
                        value={formValues.Sortdescription}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter Sortdescription"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <label className="pt-3">Refundable</label>
                    <select
                      name="returnable"  // Ensure we use "returnable" here
                      value={formValues.refundPolicies.returnable ? "yes" : "no"}  // Correct string conversion
                      onChange={handleRefundPolicyChange}  // Handle change for returnable
                      className="form-control border"

                    >
                      <option value="yes" >Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <label className="pt-3">Return Window (days)</label>
                    <input
                      type="number"
                      name="returnWindow"  // Correct field name for returnWindow
                      value={formValues.refundPolicies.returnWindow}  // Correct value handling
                      onChange={handleRefundPolicyChange}  // Handle change for returnWindow
                      className="form-control"
                      placeholder="Enter number of days"
                      min="0"
                    />
                  </div>


                  {/* images Upload */}
                  <div className="col-lg-6 col-md-6">
                    <div className="input-field">
                      <label className="pt-3">Upload images*</label>
                      <input
                        type="file"
                        name="images"
                        onChange={handleFileChange}
                        className="form-control"
                        multiple
                        required
                      />
                      <div className="file-preview d-flex flex-wrap">
                        {previewimages.length > 0 ? (
                          previewimages.map((imgSrc, index) => (
                            <div key={index} className="position-relative m-2">
                              <img
                                src={imgSrc}
                                alt={`Preview ${index}`}
                                className="img-thumbnail"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteimages(index)}
                                className="btn btn-danger btn-sm position-absolute"
                                style={{ top: 0, right: 0 }}
                              >
                                X
                              </button>
                            </div>
                          ))
                        ) : (
                          <img
                            src="img/placeholder-img.svg"
                            alt="Placeholder"
                            className="img-thumbnail"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container-box">
                  <div className="container-box-top-header justify-content-between px-4">
                    <h4>Size & Quantity</h4>
                  </div>

                  <div className="page-details px-4">
                    {formValues.productkey.map((product, index) => (
                      <div className="row mb-4 " key={index}>
                        <div className="col-lg-3 col-md-6">
                          <div className="input-field">
                            <label>Size*</label>
                            <input
                              type="text"
                              className="form-control"
                              value={product.Size}
                              onChange={(e) => handleChange(index, 'Size', e.target.value)}
                              placeholder="Enter product Size"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="input-field">
                            <label>Quantity*</label>
                            <input
                              type="text"
                              className="form-control"
                              value={product.Quantity}
                              onChange={(e) => handleChange(index, 'Quantity', e.target.value)}
                              placeholder="Enter product Quantity" required

                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="input-field">
                            <label>Offer Price*</label>
                            <input
                              type="text"
                              className="form-control"
                              value={product.OfferPrice}
                              onChange={(e) => handleChange(index, 'OfferPrice', e.target.value)}
                              placeholder="Enter offerprice"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-2 d-flex align-items-center">
                          <button
                            type="button"
                            className="btn btn-danger mt-5"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <button type="button" className="btn btn-secondary"
                      onClick={add}
                    >
                      Add More
                    </button></div>
                </div>

                <button className="sited-btn">SUBMIT</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
