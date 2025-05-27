import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./component/Auth/Login";
import Dashboard from "./component/viewmodel/Dashboard";
import Banner from "./component/viewmodel/banner";
import Footer from "./component/Common/footer";
import Header from "./component/Common/header";
import AddBanner from "./component/addServices/addBanner";
import Profile from "./component/viewmodel/Profile";
import Notification from "./component/viewmodel/notification";
import AddNotification from "./component/addServices/addnotification";
import Category from "./component/viewmodel/category";
import AddCategory from "./component/addServices/addCategory";
import SubCategory from "./component/viewmodel/subCategory";
import AddSubCategory from "./component/addServices/addSubCategory";
import Brand from "./component/viewmodel/brand";
import AddBrand from "./component/addServices/addBrand";
import Product from "./component/viewmodel/product";
import AddProduct from "./component/addServices/addProduct";

import TermsAndCondition from "./component/viewmodel/termsandConditons";
import Policy from "./component/viewmodel/policy";
import AboutUs from "./component/viewmodel/aboutUs";

import Blog from "./component/viewmodel/blog";
import AddBlog from "./component/addServices/addBlog";
import Order from "./component/viewmodel/order";
import HomeHeader from "./forntend/HomeHeader";
import Home from "./forntend/Home";
import Conatct from "./component/viewmodel/contact";
import Returns from "./component/viewmodel/return";

import Contact from "./forntend/contact/Contact";

// Slick -carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// UserInformation Components=>
import UserLogin from "./forntend/userInformation/UserLogin";
import UserRegister from "./forntend/userInformation/UserRegister";

// Slider
import Slider from "./forntend/Slider/Slider";

// Front Category
import HomeCategory from "./forntend/category/HomeCategory";

// Banner
import HomeBanner from "./forntend/banner/HomeBanner";

import AllNewArrivals from "./forntend/banner/AllNewArrivals";
import Kurti from "./forntend/banner/AllKurti";
import AllSaree from "./forntend/banner/AllSaree";
import IndoWestern from "./forntend/banner/indowestern";
// HomeProduct
import HomeProduct from "./forntend/product/HomeProduct";

import CheckOut from "./forntend/CheckOut/CheckOut";
// import Cart from './forntend/Cart/Cart';
import TrackOrder from "./forntend/Track/TrackOrder";
import About from "./forntend/About/About";
import TermCondition from "./forntend/Service/termsCondition";
import PrivacyPolicy from "./forntend/Service/privacayPolicy";
import { WishlistProvider } from "./Store/whislist";
import{CartProvider} from "./Store/addtoCart"
import ScrollToTop  from "./Store/scrooler"
import Service from "./forntend/Service/Service";
import ProductDetails from "./forntend/productlist/ProductDetails";
import AddToCart from "./forntend/Carts/AddToCart";
import UserProfile from "./forntend/userInformation/UserProfile";
import Blogs from "./forntend/Blog/Blog";
import BlogDetails from "./forntend/Blog/BlogDeatils";
import UserManager from "./component/viewmodel/userManger";
import WishList from "./forntend/CheckOut/WishList";
import Products from "./forntend/product/Product";
import Return from "./forntend/Return/return";
import ProductList from "./forntend/productlist/ProductList";
import { CurrencyProvider } from "./forntend/CurrencyContent";
import OrderDetails from "./forntend/CheckOut/orderDetails";
import OrderHistory from "./forntend/CheckOut/orderHistory";
import EditAddressPage from "./forntend/CheckOut/EditAdress";
import UserProfileEdit from "./forntend/userInformation/UserProfileEdit";
import UserInvoice from "./forntend/userInformation/UserInvoice";
import Review from "./forntend/Review/review";
import Reviews from "./component/viewmodel/review";
import Ticket from "./forntend/Ticket/Ticket";
import TicketManger from "./component/viewmodel/ticketManger";
import Pincode from "./component/viewmodel/pincode";
import AddPincode from "./component/addServices/addpincode";
const PrivateRoute = ({
  children,
  isAuthenticated,
  requiredPermission,
  isAdmin,
}) => {
  const permissions = JSON.parse(localStorage.getItem("userPermissions")) || {};

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (!isAdmin && !permissions[requiredPermission])
    return <Navigate to="/admin/dashboard" />;

  return children;
};
function LayoutWrapper({ children, isAuthenticated, isAdmin }) {
  const location = useLocation(); // Get current route
  const adminRoutes = [
    "/admin",
    "/dashboard",
    "/banner",
    "/add-banner",
    "/notification",
    "/add-notification",
    "/category",
    "/add-category",
    "/sub-category",
    "/add-sub-category",
    "/brand",
    "/add-brand",
    "/product",
    "/add-product",
    "/order",
    "/user-manger",
    "/blog",
    "/add-blog",
    "/pages",
    "/policy",
    "/terms-and-conditions",
    "/about-us",
    "/profile",
    "/Profile",
    "/enquire",
    "/review",
    "/ticket-manager",
    "/pincode",
    "/add-pincode",
    "/return",
  ];

  // Routes where Header and Footer should be hidden
  const hideLayoutRoutes = [
    "/product-details",
    "/checkout",
    "/track-order",
    "/login",
    "/register",
    "/blogs",
    "/blog/",
    "/category/",
    `/product-list/category/`,
    "/order/",
    "/contact-us",
  ];

  // Check if the current route is in admin routes
  const isAdminRoute = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Check if the current route is in the routes where we need to hide Header and Footer
  const shouldHideLayout = hideLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {/* Render Header only if it's an admin route and should not be hidden */}
      {!shouldHideLayout && isAuthenticated && isAdmin && isAdminRoute && (
        <Header />
      )}

      <div className={isAdminRoute ? "admin-layout" : ""}>{children}</div>

      {/* Render Footer only if it's an admin route and should not be hidden */}
      {!shouldHideLayout && isAuthenticated && isAdmin && isAdminRoute && (
        <Footer />
      )}
    </>
  );
}
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
      setIsAdmin(userRole === "Admin");
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <CurrencyProvider>
        <WishlistProvider>
          <CartProvider>
      <Router>
         <ScrollToTop />
        <LayoutWrapper isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
          <Routes>
            <Route
              path="/admin/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setRole={setRole}
                  />
                )
              }
            />
        
            <Route
              path="/dashboard"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="dashboard"
                  isAdmin={isAdmin}
                >
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/banner"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="banner"
                  isAdmin={isAdmin}
                >
                  <Banner />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-banner"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="add-banner"
                  isAdmin={isAdmin}
                >
                  <AddBanner />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="profile"
                  isAdmin={isAdmin}
                >
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/notification"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="notification"
                  isAdmin={isAdmin}
                >
                  <Notification></Notification>
                </PrivateRoute>
              }
            />
            <Route
              path="/add-notification"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="add-notification"
                  isAdmin={isAdmin}
                >
                  <AddNotification />
                </PrivateRoute>
              }
            />

            <Route
              path="/category"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="category"
                  isAdmin={isAdmin}
                >
                  <Category />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-category"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="add-category"
                  isAdmin={isAdmin}
                >
                  <AddCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/sub-category"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="sub-category"
                  isAdmin={isAdmin}
                >
                  <SubCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-sub-category"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="add-sub-category"
                  isAdmin={isAdmin}
                >
                  <AddSubCategory />
                </PrivateRoute>
              }
            />
            <Route
              path="/brand"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="brand"
                  isAdmin={isAdmin}
                >
                  <Brand />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-brand"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="add-brand"
                  isAdmin={isAdmin}
                >
                  <AddBrand />
                </PrivateRoute>
              }
            />
            <Route
              path="/product"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="product"
                  isAdmin={isAdmin}
                >
                  <Product />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="add-product"
                  isAdmin={isAdmin}
                >
                  <AddProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/terms-and-conditions"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="pages"
                  isAdmin={isAdmin}
                >
                  <TermsAndCondition />
                </PrivateRoute>
              }
            />
            <Route
              path="/policy"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="pages"
                  isAdmin={isAdmin}
                >
                  <Policy />
                </PrivateRoute>
              }
            />
            <Route
              path="/about-us"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="pages"
                  isAdmin={isAdmin}
                >
                  <AboutUs />
                </PrivateRoute>
              }
            />

            <Route
              path="/blog"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="blog"
                  isAdmin={isAdmin}
                >
                  <Blog />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-blog"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="blog"
                  isAdmin={isAdmin}
                >
                  <AddBlog />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-manger"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="user-manger"
                  isAdmin={isAdmin}
                >
                  <UserManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/enquire"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="contact"
                  isAdmin={isAdmin}
                >
                  <Conatct />
                </PrivateRoute>
              }
            />
            <Route
              path="/ticket-manager"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="ticket-manager"
                  isAdmin={isAdmin}
                >
                  <TicketManger />
                </PrivateRoute>
              }
            />

            <Route
              path="/order"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="order"
                  isAdmin={isAdmin}
                >
                  <Order />
                </PrivateRoute>
              }
            />

            <Route
              path="/review"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="review"
                  isAdmin={isAdmin}
                >
                  <Reviews />
                </PrivateRoute>
              }
            />

            <Route
              path="/pincode"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="pincode"
                  isAdmin={isAdmin}
                >
                  <Pincode />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-pincode"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="pincode"
                  isAdmin={isAdmin}
                >
                  <AddPincode />
                </PrivateRoute>
              }
            />
            <Route
              path="/return"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  requiredPermission="return"
                  isAdmin={isAdmin}
                >
                  <Returns />
                </PrivateRoute>
              }
            />

            {/* front Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user-profile-edit" element={<UserProfileEdit />} />
            <Route path="/slider" element={<Slider />} />
            <Route path="/fornt-category" element={<HomeCategory />} />
            <Route path="/fornt-banner" element={<HomeBanner />} />
            <Route path="/home-product" element={<Products />} />
            

            <Route path="/all-new-arrivals" element={<AllNewArrivals />} />
            <Route path="/kurti" element={<Kurti />} />

            <Route path="/saree" element={<AllSaree />} />
            <Route path="/indo-western" element={<IndoWestern />} />

            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/add-to-cart" element={<AddToCart />} />
            <Route path="/track-order/:orderId/:orderProductId" element={<TrackOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/termscondition" element={<TermCondition />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/category" element={<Category />} />

            <Route path="/service" element={<Service />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/product-details/:id" element={<ProductDetails />} />
            <Route path="/:type/:id" element={<ProductList />} />
            <Route path="/user-invoice" element={<UserInvoice />} />
            <Route path="/review/:id" element={<Review />} />
            <Route path="/return-request/:id" element={<Return />} />
            {/* category router */}
            <Route path="/category" element={<Category />} />
            <Route path="/cancel2" element={<Category />} />
            <Route path="/submit2" element={<Category />} />
            <Route
              path="/edit-address/:id"
              element={<EditAddressPage />}
            ></Route>

            {/* // product router */}
            <Route path="/homeheader" element={<HomeHeader />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:encodedBlogId" element={<BlogDetails />} />
            <Route path="/ticket/:orderProductId" element={<Ticket />} />
            <Route path="/home" element={<Home />} />
            <Route path="/producthome" element={<HomeProduct />} />
            <Route path="/order-Details" element={<OrderDetails />} />
            <Route path="/Your-Orders" element={<OrderHistory />} />
          </Routes>
        </LayoutWrapper>
        <ToastContainer />
      </Router>
      </CartProvider>
      </WishlistProvider>
    </CurrencyProvider>
  );
}

export default App;
