import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./dashboard/Dashboard";
import Cart from "./pages/Cart";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import Users from "./dashboard/Users";
import Orders from "./dashboard/Orders";
import Items from "./dashboard/Items";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/explore/:category" element={<Explore />} />
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/setting" element={<Settings />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/adminsetting" element={<Settings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/items" element={<Items />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
