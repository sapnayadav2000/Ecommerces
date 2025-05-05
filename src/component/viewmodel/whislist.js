import React, { useState } from "react";
import WishlistServices from "../../services/wishlistServices"; // Changed to WishlistServices
import Pagetitle from "./pagetitle";
import useAsync from "../../Hooks/useAsync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Wishlist = () => {
  const { data, run } = useAsync(WishlistServices.AllWishlist); // Fetch wishlist instead of orders
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Search Input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter Wishlist based on Product Name
  const filteredWishlist = data?.data?.filter((wishlistItem) =>
    wishlistItem.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="right_col" role="main">
        <Pagetitle />

        <div className="container-box px-0">
          <div className="container-box-top-header px-4">
            <div className="container-box-top-header-left-2">
              <input
                type="search"
                name="search"
                placeholder="Search by user Name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>

          <div className="container-box-inner">
            <table id="wishlist-table" className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Wishlist ID</th>
                  <th>User ID</th>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Created At</th>
             
                </tr>
              </thead>
              <tbody>
  {filteredWishlist?.map((wishlist) => (
    <tr key={wishlist._id}>
      <td>{wishlist._id}</td>
      <td>{wishlist.userId?.name || "N/A"}</td>  {/* FIXED */}
      <td>
        {wishlist.products.map((product) => (
          <div key={product.productId?._id} className="product-item">
            <img
              src={
                product.productId?.images?.length > 0
                  ? `${process.env.REACT_APP_API_BASE_URL}/${product.productId.images[0]}`
                  : "/placeholder.jpg"
              }
              alt={product.productId?.name}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "5px",
                marginRight: "5px",
                marginTop:"4px"
              }}
            />
            {product.productId?.name}
          </div>
        )) || "N/A"}
      </td>
      <td>
        {wishlist.products.map((product) => (
          <div key={product.productId?._id} className="product-item">
            {product.productId?.price || "N/A"}
          </div>
        ))}
      </td>
    
      <td>{new Date(wishlist.createdAt).toLocaleString()}</td>
    
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
