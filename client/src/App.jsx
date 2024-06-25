import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./Dashboard/Dashboard";
import Cart from "./pages/Cart";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import Users from "./Dashboard/Users";
import Orders from "./Dashboard/Orders";
import Products from "./Dashboard/Products";
import AddProduct from "./Dashboard/AddProduct";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";
import Product from "./pages/Product";
import Brand from "./Dashboard/Brand";
import BuySingle from "./pages/BuySingle";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id/:colorIndex" element={<Product />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore/:Category" element={<Explore />} />
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/setting" element={<Settings />} />
          <Route path="/buy/:id/:colorIndex" element={<BuySingle />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminsetting" element={<Settings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/products" element={<Products />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/brands" element={<Brand />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
