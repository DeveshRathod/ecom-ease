import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./store/reducers/user.slice";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:4000/api/user/me",
            {
              headers: {
                authorization: `${token}`,
              },
            }
          );

          const userData = await response.data;
          dispatch(setUser(userData.user));

          const user = JSON.stringify(userData.user);
          localStorage.setItem("currentUser", user);
        } else {
          localStorage.setItem("currentUser", null);
          <Navigate to="/signin" />;
        }
      } catch (error) {
        <Navigate to="/signin" />;
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
