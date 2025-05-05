import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <p>
        Software Design & Developed By :{" "}
        <Link
          to="https://www.truevalueinfosoft.com/"
          target="_blank"
          style={{
            textDecoration: "none",
            display: "inline-block",
            color: "#000",
          }}
        >
          True Value Infosoft (P) Limited
        </Link>
      </p>
      <p>V.1.0</p>
    </footer>
  );
}

export default Footer;
