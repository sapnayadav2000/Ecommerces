
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

// Import icons from react-icons
import {
  FaTachometerAlt,
  FaUser,
  FaImage,
  FaBell,
  FaBoxOpen,
  FaCog,
  FaFileAlt,
  FaBlog,
  FaShoppingCart,
  FaUndo,
  FaQuestionCircle,
  FaStar,
  FaTicketAlt,
  FaMapPin,
  FaArrowLeft
} from "react-icons/fa";


const SideBar = () => {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [permissions, setPermissions] = useState({});
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const storedPermissions =
      JSON.parse(localStorage.getItem("userPermissions")) || {};
    setPermissions(storedPermissions);
  }, []);

  const handleToggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((prevState) => !prevState);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("sidebar-open");
      document.body.classList.remove("sidebar-closed");
    } else {
      document.body.classList.add("sidebar-closed");
      document.body.classList.remove("sidebar-open");
    }
  }, [isOpen]);

  const menuItems = [
    { name: "Dashboard", key: "dashboard", icon: <FaTachometerAlt /> },
    { name: "User Manger", key: "user-manger", path: "/user-manger", icon: <FaUser /> },
    { name: "App Banner", key: "banner", path: "/banner", icon: <FaImage /> },
    { name: "Notification", key: "notification", path: "/notification", icon: <FaBell /> },
    {
      name: "Product",
      key: "product",
      icon: <FaBoxOpen  />,
      subItems: [
        { name: "Category", key: "category", path: "/category" },
        { name: "Sub Category", key: "sub-category", path: "/sub-category" },
        { name: "Brand", key: "brand", path: "/brand" },
        { name: "Product", key: "product-item", path: "/product" },
      ],
    },
    {
      name: "Settings",
      key: "settings",
      icon: <FaCog />,
      subItems: [{ name: "Profile", key: "profile", path: "/profile" }],
    },
    {
      name: "Pages",
      key: "pages",
      icon: <FaFileAlt />,
      subItems: [
        { name: "Policy", key: "policy", path: "/policy" },
        { name: "AboutUs", key: "about-us", path: "/about-us" },
        { name: "Term & Conditions", key: "terms-and-conditions", path: "/terms-and-conditions" },
      ],
    },
    { name: "Blog", key: "blog", path: "/blog", icon: <FaBlog /> },
    { name: "Order", key: "order", path: "/order", icon: <FaShoppingCart /> },
    { name: "Return Manager", key: "return", path: "/return", icon: <FaUndo /> },
    { name: "Enquire", key: "enquire", path: "/enquire", icon: <FaQuestionCircle /> },
    { name: "Manage Review", key: "review", path: "/review", icon: <FaStar /> },
    { name: "Ticket Manager", key: "ticket-manager", path: "/ticket-manager", icon: <FaTicketAlt /> },
    { name: "Pincode", key: "pincode", path: "/pincode", icon: <FaMapPin /> },
  ];

  const renderMenuItem = (name, key, icon, subItems) => {
    if (role === "Admin" || permissions[key]) {
      return (
        <li key={key} className="sidebar-item">
          {subItems ? (
            <>
              <div onClick={() => handleToggleSubMenu(key)} className="sidebar-link toggle-submenu">
                <span className="sidebar-icon">{icon}</span>
                {isOpen && <span className="sidebar-text ">{name} <i class="fa fa-chevron-down ml-4"></i></span>}
              </div>
              {openSubMenu === key && isOpen && (
                <ul className="submenu ">
                  {subItems.map((subItem) => (
                    <li key={subItem.key}>
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) =>
                          `sub-link ${isActive ? "active-sublink" : ""}`
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <NavLink
              to={`/${key}`}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active-link" : ""}`
              }
            >
              <span className="sidebar-icon">{icon}</span>
              {isOpen && <span className="sidebar-text">{name}</span>}
            </NavLink>
          )}
        </li>
      );
    }
    return null;
  };

  return (
    <div className="main-container">
      <motion.div className="sidebar" style={{ width: isOpen ? "325px" : "100px" }}>
      <div
  className="toggle"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    maxWidth: "300px", // Optional: limit width for smaller sidebars
    padding: "0 10px",  // Optional: add horizontal padding
    height: "80px",
 
  }}
>
  {isOpen && (
    <img
      src="/img/adminlogo.png"
      alt="logo"
      style={{
        width: "70px",
        height: "70px",
        transition: "all 0.3s ease"
      }}
    />
  )}

  <button
    className="btn toggle-btn"
    onClick={toggle}
    style={{
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0,
      cursor: 'pointer'
    }}
  >
    <img
      src="/img/previous.svg"
      alt="Toggle"
      style={{
        width: '30px',
        height: '30px'
      }}
    />
  </button>
</div>

        <ul className="sidebar-menu">
          {menuItems.map((item) =>
            renderMenuItem(item.name, item.key, item.icon, item.subItems)
          )}
        </ul>
      </motion.div>
    </div>
  );
};

export default SideBar;
