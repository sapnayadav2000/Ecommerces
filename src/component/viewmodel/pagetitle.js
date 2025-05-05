import React from "react";
import Breadcrumb from "./Breadcrumb";
import { useLocation } from "react-router-dom";

const Pagetitle = () => {
  const location = useLocation();
  const pageTitle = location.pathname
    .replace(/^\//, "") // Remove leading slash
    .replace(/-/g, " "); // Replace hyphens with spaces

  return (
    <div className="title-box">
      <h2>{pageTitle}</h2>
      <Breadcrumb pageTitle={pageTitle} />
    </div>
  );
};

export default Pagetitle;
