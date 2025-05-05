import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddressServices from "../../services/adressServices";
import AddtoCartServices from "../../services/AddtoCart";
import HomeHeader from "../HomeHeader";
import Footer from "../Footer";
import { toast } from "react-toastify";
const EditAddressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await AddressServices.getByIdAdress(id);
        if (response?.data) {
          setFormData(response.data);
        }
      } catch (error) {
        console.error("Error loading address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await AddtoCartServices.getAllCart();
        const cartArray = response.data;
        if (Array.isArray(cartArray) && cartArray.length > 0) {
          setCart(cartArray[0]);
        }
      } catch (error) {
        console.error("Failed to fetch cart", error);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddressServices.updateAddress(id, formData);
      toast.success("Address updated successfully");
      navigate("/order-details", {
        state: { cartId: cart?._id },
      });
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Error updating address:", error);
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm rounded-4">
              <div className="card-body p-4">
                <h4 className="mb-4 text-center">Edit Address</h4>

                {loading ? (
                  <p className="text-center">Loading address...</p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 ">
                      {[
                        "firstName",
                        "lastName",
                        "phone",
                        "address",
                        "city",
                        "state",
                        "pincode",
                        "country",
                      ].map((field) => (
                        <div className="col-md-6" key={field}>
                          <label className="form-label mt-3">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name={field}
                            value={formData[field] || ""}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="btn btn-success px-4 ">
                        Update Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditAddressPage;
