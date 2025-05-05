import React from "react";
import { useLocation } from "react-router-dom";

const Breadcrumb = ({ pageTitle }) => {
  const location = useLocation();

  return (
    <ul className="d-flex list-unstyled ">
      <li>
        <a href="/dashboard">Dashboard</a>
      </li>
      <li className="mx-2">/</li>
      <li>{pageTitle || location.pathname.split("/").pop()}</li>
    </ul>
  );
};

export default Breadcrumb;
