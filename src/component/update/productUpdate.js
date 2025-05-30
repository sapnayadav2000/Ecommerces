import React, { useState, useEffect } from "react";
import Productservices from "../../services/productServices";
import CategoryServices from "../../services/categoryServices";
import SubCategoryServices from "../../services/addSubCategory";
import BrandService from "../../services/brandServices";
function ProductUpdate({ product, onSuccess, closeModal }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [previewImages, setPreviewImages] = useState(["img/placeholder-img.png"]);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    Sortdescription: "",
    price: "",
    Originalprice: "",
    brand: "",
    subCategory: "",
    category: "",
    images: [],
    productkey: [{
      Size: "",
      Quantity: "",
      OfferPrice: "",
    }],
    Originalprice: product?.Originalprice || "",
    refundPolicies: {
      returnable: true,
      returnWindow: 30,
    },
  });

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








  // console.log("Form Values After Submit:", formValues);




  useEffect(() => {
    const loadInitialData = async () => {
      if (product) {
        const refundData =
          typeof product.refundPolicies === "string"
            ? JSON.parse(product.refundPolicies)
            : product.refundPolicies;

        const selectedCategoryId = Array.isArray(product?.category)
          ? product.category[0]?._id
          : product?.category;

        const selectedSubCategoryId = Array.isArray(product?.subCategory)
          ? product.subCategory[0]?._id
          : product?.subCategory;

        setFormValues({
          _id: product?._id || "",
          name: product?.name || "",
          description: product?.description || "",
          Sortdescription: product?.Sortdescription || "",
          refundPolicies: refundData,
          price: product?.price || "",
          Originalprice: product?.Originalprice || "",
          brand: Array.isArray(product?.brand) ? product.brand[0] : product?.brand || "",
          subCategory: selectedSubCategoryId || "",
          category: selectedCategoryId || "",
          images: product?.images || [],
          productkey: product?.productkey || [],
        });

        if (product.images && product.images.length > 0) {
          setPreviewImages(
            product.images.map((img) => `${process.env.REACT_APP_API_BASE_URL}/${img}`)
          );
        }

        // 👉 Fetch subcategories for the selected category
        if (selectedCategoryId) {
          try {
            const subcatResponse = await SubCategoryServices.getSubCategoryByCategory(selectedCategoryId);
            if (Array.isArray(subcatResponse)) {
              setSubCategories(subcatResponse);
            } else {
              setSubCategories([]);
            }
          } catch (err) {
            console.error("Error fetching subcategories on load", err);
            setSubCategories([]);
          }
        }
      }
    };

    loadInitialData();
  }, [product]);


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
    console.log("Updated subcategories state:", subcategories);
  }, [subcategories]);
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
  const handleCategoryChange = async (event) => {
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

        // Fix: Use response directly if it's already an array
        if (Array.isArray(response)) {
          console.log("Setting subcategories:", response);
          setSubCategories(response);
        } else {
          console.log("No subcategories found.");
          setSubCategories([]); // Reset if no data
        }
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
        setSubCategories([]); // Reset on error
      }
    } else {
      setSubCategories([]); // Reset when category is unselected
    }
  };

  const handleSubCategoryChange1 = (event) => {
    setFormValues((prev) => ({ ...prev, subCategory: event.target.value }));
  };


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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleImageDelete = async (index, imagePath) => {
    try {
      const productId = formValues._id; // Assuming productId is stored in formValues

      if (!productId) {
        alert("Product ID is missing!");
        return;
      }

      await Productservices.deleteImage(imagePath, productId); // Pass productId to the backend

      // Update state to remove image from UI
      const updatedImages = formValues.images.filter((_, i) => i !== index);
      const updatedPreviews = previewImages.filter((_, i) => i !== index);

      setFormValues({ ...formValues, images: updatedImages });
      setPreviewImages(updatedPreviews);
    } catch (error) {
      console.error("Failed to delete image", error);
      alert("Failed to delete image");
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const filePreviews = files.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...filePreviews]);
      setFormValues({ ...formValues, images: [...formValues.images, ...files] });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      // Append non-array fields normally
      Object.keys(formValues).forEach((key) => {
        if (key !== "images" && key !== "productkey" && key !== "refundPolicies") {
          formData.append(key, formValues[key]);
        }
      });

      // Append images
      formValues.images.forEach((image) => {
        formData.append("images", image);
      });

      // Append productkey as a JSON string
      formData.append("productkey", JSON.stringify(formValues.productkey));

      // Append refundPolicies as a JSON string
      formData.append("refundPolicies", JSON.stringify(formValues.refundPolicies));

      // Send data to the backend
      await Productservices.updateproduct(product._id, formData);

      alert("Product updated successfully");
      onSuccess();
      closeModal();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update Product");
    }
  };

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
    <div
      className="modal fade edit-box show d-block"
      id="editModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered   modal-dialog-scrollable ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"> Edit Product</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={closeModal}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="container-box px-5">
              <div className="container-box-inner">
                <div className="page-details">
                  <form onSubmit={handleSubmit}>
                    <div className="row">


                      {/* Category */}
                      <div className="col-lg-6 col-md-6">
                        <div className="input-field">
                          <label className="pt-3">Category</label>
                          <select
                            className="form-control border"
                            name="Category"
                            value={formValues.category}
                            onChange={handleCategoryChange}
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
                      <div className="col-lg-6 col-md-6">
                        <div className="input-field">
                          <label className="pt-3">Subcategory</label>
                          <select
                            className="form-select border mt-3"
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
                      <div className="col-lg-6 col-md-6">
                        <div className="input-field">
                          <label className="pt-3">Brand</label>
                          <select
                            className="form-control border"
                            name="Category"
                            value={formValues.brand}
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
                      <div className="col-lg-6 col-md-6">
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
                          <label className="pt-3">Original price*</label>
                          <input
                            type="number"
                            name="Originalprice"
                            value={formValues.Originalprice}
                            onChange={handleInputChange}

                            placeholder="Enter Originalprice"
                            className="form-control"
                          />
                        </div>
                      </div>


                      {/* Price */}
                      <div className="col-lg-4 col-md-6">
                        <div className="input-field">
                          <label className="pt-3">Price</label>
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
                      <div className="col-md-12">
                        <label className="pt-3">Refundable</label>
                        <select
                          name="returnable"  // Ensure we use "returnable" here
                          value={formValues.refundPolicies.returnable ? "yes" : "no"}  // Correct string conversion
                          onChange={handleRefundPolicyChange}  // Handle change for returnable
                          className="form-control border"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="col-md-12">
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



                      {/* Image Upload */}
                      <div className="col-lg-6 col-md-6">
                        <div className="input-field">
                          <label className="pt-3">Upload Images* <small>(Supports multiple files)</small></label>
                          <input type="file" multiple onChange={handleFileChange} className="form-control" />
                          <div className="file-preview d-flex flex-wrap">
                            {previewImages.map((img, index) => (
                              <div key={index} className="position-relative m-1">
                                <img
                                  src={img}
                                  alt="Preview"
                                  className="img-thumbnail"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                  onClick={() => {
                                    if (!formValues._id) {
                                      alert("Product ID is not available!");
                                      return;
                                    }
                                    console.log("Deleting image:", { index, imagePath: formValues.images[index] }); // Debugging
                                    handleImageDelete(index, formValues.images[index]); // ✅ Corrected
                                  }}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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
                                placeholder="Enter product Quantity"
                                required
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
                              className="btn btn-danger"
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


                    <button className="sited-btn-green">Update </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductUpdate;
