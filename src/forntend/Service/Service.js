import React from "react";
import { FiTruck, FiRefreshCw, FiHeadphones } from "react-icons/fi";

const Service = () => {
  return (
    <section className="py-5 ">
      <div className="container">
        <div className="row g-4 justify-content-center">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-light h-100 text-center">
              <FiTruck size={40} color="#ff007f" className="mb-3" />
              <h5 className="fw-bold">Unlimited Delivery</h5>
              
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-light h-100 text-center">
              <FiRefreshCw size={40} color="#ff007f" className="mb-3" />
              <h5 className="fw-bold">Free Returns</h5>
              
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-light h-100 text-center">
              <FiHeadphones size={40} color="#ff007f" className="mb-3" />
              <h5 className="fw-bold">24/7 Support</h5>
             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Service;
