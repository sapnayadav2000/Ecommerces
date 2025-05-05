import React from "react";
import { FiTruck, FiRefreshCw, FiHeadphones } from "react-icons/fi";

const services = [
  { icon: <FiTruck />, title: "Unlimited Delivery" },
  { icon: <FiRefreshCw />, title: "Free Returns" },
  { icon: <FiHeadphones />, title: "24/7 Support" },
];

const Service = () => {
  return (
    <section className="py-5 bg-gradient-to-b from-white to-pink-50">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {services.map((service, index) => (
            <div className="col-md-4" key={index}>
              <div
                className="service-card p-4 text-center h-100 shadow rounded-4"
                style={{
                  background: "rgba(255, 255, 255, 0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="icon mb-3" style={{ fontSize: "2.5rem", color: "#ff007f" }}>
                  {service.icon}
                </div>
                <h5 className="fw-bold">{service.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .service-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .service-card .icon {
          transition: transform 0.3s;
        }
        .service-card:hover .icon {
          transform: scale(1.2) rotate(5deg);
        }
      `}</style>
    </section>
  );
};

export default Service;
