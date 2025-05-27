import React ,{useState} from "react";
import { Link } from "react-router-dom";

function Footer() {
   const [isHovered, setIsHovered] = useState(false);
  return (
    <footer>
      <p>
        Software Design & Developed By :{" "}
          <Link
      to="https://www.truevalueinfosoft.com/"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: "none",
        display: "inline-block",
        color: isHovered ? "#007bff" : "#000", // Blue on hover
        transition: "color 0.3s ease",
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
