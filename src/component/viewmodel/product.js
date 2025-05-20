import Pagetitle from "./pagetitle";
import HelpTogal from "../Togal/HelpTogal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useAsync from "../../Hooks/useAsync";
import Productservices from "../../services/productServices.js";
import { useState } from "react";
import Modal from "react-modal";
import ProductUpdate from "../update/productUpdate.js";
import DeleteButton from "../delete/deleteButton.js";


Modal.setAppElement("#root");

function Product() {
  const { data, run } = useAsync(Productservices.getproduct);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Filter products by search term
  const filteredData = data?.data?.length
    ? data.data.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalProducts = filteredData.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredData.slice(startIndex, endIndex);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // reset to first page on search
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEdit(null);
  };

  const handleDelete = (product) => {
    setSelectedEdit(product);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEdit(null);
  };

  const handleEditDetails = (product) => {
    setSelectedEdit(product);
    setIsEditModalOpen(true);
  };

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
                placeholder="Search by Product name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <div className="sub-title-box-right">
              <Link
                className="Add-new-btn site-btn-green me-5"
                to="/add-product"
              >
                <img src="img/add-plus.svg" alt="Add" />
                <span className="ms-2">Add New</span>
              </Link>
            </div>
          </div>

          <div className="container-box-inner" style={{ overflowX: "auto" }}>
            <table id="example" className="table">
              <thead>
                <tr className="trs">
                  <th>#</th>
                  <th>Images</th>
                  <th>Category Name</th>
                  <th>Sub Category Name</th>
                  <th>Brand Name</th>
                  <th>Name</th>
                  <th>Sort Description</th>
                  <th>Price</th>
                  <th>Original Price</th>
                  <th>Policies</th>
                  <th>Offer Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts?.map((product, i) => (
                  <tr key={i}>
                    <td>{startIndex + i + 1}</td>
                    <td>
                      {/* <div className="product-img">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                          product.images.map((img, index) => (
                            <img
                              key={index}
                              src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
                              alt="product"
                              style={{
                                height: "70px",
                                width: "70px",
                                objectFit: "contain",
                                marginRight: "5px",
                                marginTop: "5px",
                              }}
                            />
                          ))
                        ) : product.images ? (
                          <img
                            src={`${process.env.REACT_APP_API_BASE_URL}/${product.images}`}
                            alt="product"
                            style={{
                              height: "70px",
                              width: "70px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div> */}
                      <div className="product-img">
  {Array.isArray(product.images) && product.images.length > 0 ? (
    <img
      src={`${process.env.REACT_APP_API_BASE_URL}/${product.images[0]}`}
      alt="product"
      style={{
        height: "70px",
        width: "70px",
        objectFit: "contain",
        marginRight: "5px",
        marginTop: "5px",
      }}
    />
  ) : product.images ? (
    <img
      src={`${process.env.REACT_APP_API_BASE_URL}/${product.images}`}
      alt="product"
      style={{
        height: "70px",
        width: "70px",
        objectFit: "contain",
      }}
    />
  ) : (
    <span>No Image</span>
  )}
</div>

                    </td>
                    <td>{product.categoryname?.join(", ") || "N/A"}</td>
                    <td>{product.subCategoryname?.join(", ") || "N/A"}</td>
                    <td>{product.brandname?.join(", ") || "N/A"}</td>
                    <td>{product.name}</td>
                    <th>{product.Sortdescription}</th>
                    <td>{product.price}</td>
                    <td>{product.Originalprice}</td>
                    <td>
                      {product.refundPolicies?.returnable === true
                        ? `${product.refundPolicies.returnWindow} Days`
                        : "No Refund Policy"}
                    </td>
                    <td>
                      {product.productkey?.length
                        ? product.productkey.map((item) =>
                            item.OfferPrice
                              ? ` ${item.Size}: ${item.OfferPrice} `
                              : "N/A"
                          )
                        : "N/A"}
                    </td>
                    <td className="status-toggle">
                      <HelpTogal
                        help={product}
                        page="product"
                        onSuccess={() => run()}
                      />
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Actions
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item  bg-primary"
                              onClick={() => handleEditDetails(product)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-2" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item bg-danger"  
                              onClick={() => handleDelete(product)}
                            >
                              <FontAwesomeIcon icon={faTrash} className="me-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls d-flex justify-content-center my-3">
            <button
              className="btn btn-sm btn-secondary mx-1"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm mx-1 ${
                  currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn btn-sm btn-secondary mx-1"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Edit Product Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          contentLabel="Edit Product"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <ProductUpdate
            product={selectedEdit}
            closeModal={closeEditModal}
            onSuccess={run}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <DeleteButton
            data={selectedEdit}
            page="product"
            closeModal={closeDeleteModal}
            onSuccess={run}
          />
        </Modal>
      </div>
    </>
  );
}

export default Product;








// import Pagetitle from "./pagetitle";
// import HelpTogal from "../Togal/HelpTogal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";
// import useAsync from "../../Hooks/useAsync";
// import Productservices from "../../services/productServices.js";
// import { useState } from "react";
// import Modal from "react-modal";
// import ProductUpdate from "../update/productUpdate.js";
// import DeleteButton from "../delete/deleteButton.js";
// import Footer from "../../forntend/Footer.js";

// Modal.setAppElement("#root");

// function Product() {
//   const { data, run } = useAsync(Productservices.getproduct);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [selectedEdit, setSelectedEdit] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const filteredData = data?.data?.length
//     ? data.data.filter((product) =>
//         product.name?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : [];

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const closeDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSelectedEdit(null);
//   };

//   const handleDelete = (product) => {
//     setSelectedEdit(product);
//     setIsDeleteModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedEdit(null);
//   };

//   const handleEditDetails = (product) => {
//     setSelectedEdit(product);
//     setIsEditModalOpen(true);
//   };

//   return (
//     <>
//       <div className="right_col" role="main">
//         <Pagetitle />
//         <div className="container-box px-0">
//           <div className="container-box-top-header px-4">
//             <div className="container-box-top-header-left-2">
//               <input
//                 type="search"
//                 name="search"
//                 placeholder="Search by Product name"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//               <button className="search-btn">
//                 <FontAwesomeIcon icon={faSearch} />
//               </button>
//             </div>
//             <div className="sub-title-box-right">
//               <Link
//                 className="Add-new-btn site-btn-green me-5"
//                 to="/add-product"
//               >
//                 <img src="img/add-plus.svg" alt="Add" />
//                 <span className="ms-2">Add New</span>
//               </Link>
//             </div>
//           </div>

//           <div className="container-box-inner" style={{ overflowX: "auto" }}>
//             <table id="example" className="table">
//               <thead>
//                 <tr className="trs">
//                   <th>#</th>
//                   <th>Images</th>
//                   <th>Category Name</th>
//                   <th>Sub Category Name</th>
//                   <th>Brand Name</th>
//                   <th>Name</th>
//                   <th>Description</th>
//                   <th>Sort Description</th>
//                   <th>Price</th>
//                   <th>Original Price</th>
//                   <th>Offer Price</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData?.map((product, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>
//                     <td>
//                       <div className="product-img">
//                         {Array.isArray(product.images) && product.images.length > 0 ? (
//                           product.images.map((img, index) => (
//                             <img
//                               key={index}
//                               src={`${process.env.REACT_APP_API_BASE_URL}/${img}`}
//                               alt="product"
//                               style={{
//                                 height: "70px",
//                                 width: "70px",
//                                 objectFit: "contain",
//                                 marginRight: "5px",
//                                 marginTop: "5px",
//                               }}
//                             />
//                           ))
//                         ) : product.images ? (
//                           <img
//                             src={`${process.env.REACT_APP_API_BASE_URL}/${product.images}`}
//                             alt="product"
//                             style={{
//                               height: "70px",
//                               width: "70px",
//                               objectFit: "contain",
//                             }}
//                           />
//                         ) : (
//                           <span>No Image</span>
//                         )}
//                       </div>
//                     </td>
//                     <td>{product.categoryname?.join(", ") || "N/A"}</td>
//                     <td>{product.subCategoryname?.join(", ") || "N/A"}</td>
//                     <td>{product.brandname?.join(", ") || "N/A"}</td>
//                     <td>{product.name}</td>
//                     <td>{product.description}</td>
//                     <td>{product.Sortdescription}</td>
//                     <td>{product.price}</td>
//                     <td>{product.Originalprice}</td>
//                     <td>
//                       {product.productkey?.length
//                         ? product.productkey.map((item) =>
//                             item.OfferPrice
//                               ? `${item.Size}: ${item.OfferPrice} `
//                               : "N/A"
//                           )
//                         : "N/A"}
//                     </td>
//                     <td className="status-toggle">
//                       <HelpTogal
//                         help={product}
//                         page="product"
//                         onSuccess={() => run()}
//                       />
//                     </td>
//                     <td>
//                       <div className="dropdown">
//                         <button
//                           className="btn btn-sm btn-outline-secondary dropdown-toggle"
//                           type="button"
//                           data-bs-toggle="dropdown"
//                           aria-expanded="false"
//                         >
//                           Actions
//                         </button>
//                         <ul className="dropdown-menu">
//                           <li>
//                             <button
//                               className="dropdown-item"
//                               onClick={() => handleEditDetails(product)}
//                             >
//                               <FontAwesomeIcon icon={faEdit} className="me-2" />
//                               Edit
//                             </button>
//                           </li>
//                           <li>
//                             <button
//                               className="dropdown-item text-danger"
//                               onClick={() => handleDelete(product)}
//                             >
//                               <FontAwesomeIcon icon={faTrash} className="me-2" />
//                               Delete
//                             </button>
//                           </li>
//                         </ul>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Edit Product Modal */}
//         <Modal
//           isOpen={isEditModalOpen}
//           onRequestClose={closeEditModal}
//           contentLabel="Edit Product"
//           className="modal-content"
//           overlayClassName="modal-overlay"
//         >
//           <ProductUpdate
//             product={selectedEdit}
//             closeModal={closeEditModal}
//             onSuccess={run}
//           />
//         </Modal>

//         {/* Delete Confirmation Modal */}
//         <Modal
//           isOpen={isDeleteModalOpen}
//           onRequestClose={closeDeleteModal}
//           contentLabel="Delete Confirmation"
//           className="modal-content"
//           overlayClassName="modal-overlay"
//         >
//           <DeleteButton
//             data={selectedEdit}
//             page="product"
//             closeModal={closeDeleteModal}
//             onSuccess={run}
//           />
//         </Modal>
//       </div>
//     </>
//   );
// }

// export default Product;
