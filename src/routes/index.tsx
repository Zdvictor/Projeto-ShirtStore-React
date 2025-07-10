import {Routes, Route } from "react-router-dom";

//PAGES
import Home from "../pages/home";
import Product from "../pages/product"
import Products from "../pages/products";
import Login from "../pages/login"
import Register from "../pages/register";
import ForgotPassword from "../pages/forgot";
import Validate from "../pages/validate";
import Profile from "../pages/profile";
import Cart from "../pages/cart";
import Checkout from "../pages/checkout";
import Orders from "../pages/orders";
import NotFound from "../pages/not-found";
import About from "../pages/about";



//MIDDlEWARE
import ProtectedRouteForRedirect from "../middlewares/ProtectedRoute";
import ProtectedRouteForValidator from "../middlewares/ProtectedRouterForValidator";
import ProtectedRouterAuthenticated from "../middlewares/ProtectedRouterAuthenticated";


const RouterApp: React.FC = () => {
  return (

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<ProtectedRouteForRedirect> <Login /> </ProtectedRouteForRedirect>} />
        <Route path="/register" element={<ProtectedRouteForRedirect> <Register /> </ProtectedRouteForRedirect>} />
        <Route path="/forgot-password" element={<ProtectedRouteForRedirect> <ForgotPassword /> </ProtectedRouteForRedirect>} />
        <Route path="/validate" element={<ProtectedRouteForValidator> <Validate /> </ProtectedRouteForValidator>} />
        <Route path="/profile/:action?" element={<ProtectedRouterAuthenticated> <Profile /> </ProtectedRouterAuthenticated>} />
        <Route path="/cart" element={<ProtectedRouterAuthenticated> <Cart /> </ProtectedRouterAuthenticated> } />
        <Route path="/checkout" element={<ProtectedRouterAuthenticated> <Checkout /> </ProtectedRouterAuthenticated> } />
        <Route path="/orders" element={<ProtectedRouterAuthenticated> <Orders /> </ProtectedRouterAuthenticated> } />
        <Route path="/about" element={<About />} />
        
        <Route path="*" element={<NotFound />} />
        
        
      </Routes>

  );
};

export default RouterApp;
