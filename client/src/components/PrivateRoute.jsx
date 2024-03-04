import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";

const PrivateRoute = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
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
          navigate("/signin");
          localStorage.setItem("currentUser", null);
        }
      } catch (error) {
        navigate("/signin");
        localStorage.setItem("currentUser", null);
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, []);

  return currentUser && !currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
