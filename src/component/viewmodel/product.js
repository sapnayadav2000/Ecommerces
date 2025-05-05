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
import Footer from "../../forntend/Footer.js";

Modal.setAppElement("#root");

function Product() {
  const { data, run } = useAsync(Productservices.getproduct);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter products by search term
  const filteredData = data?.data?.length
    ? data.data.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
                  <th scope="col">#</th>
                  <th scope="col">Images</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Sub Category Name</th>
                  <th scope="col">Brand Name</th>
                  <th scope="col">Name</th>
                  {/* <th scope="col">Description</th> */}
                  <th scope="col">Sort Description</th>
                  <th scope="col">Price</th>
                  <th scope="col">Originalprice</th>
                  <th scope="col">Policies</th>
                  <th scope="col">Offer Price</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                  
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((product, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="product-img">
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
                      </div>
                    </td>
                    <td>{product.categoryname?.join(", ") || "N/A"}</td>
                    <td>{product.subCategoryname?.join(", ") || "N/A"}</td>
                    <td>{product.brandname?.join(", ") || "N/A"}</td>
                    <td>{product.name}</td>
                    {/* <td>{product.description}</td> */}
                    <th>{product.Sortdescription}</th>
                    <td>
                     
                    {product.price}
                    </td>
                    <td>
                     
                    {product.Originalprice}
                    </td>
                    <td>{product.refundpolicies}</td>
                    <td>
                      {product.productkey?.length
                        ? product.productkey.map(
                            (item) =>
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
                              className="dropdown-item"
                              onClick={() => handleEditDetails(product)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-2" />
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
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
