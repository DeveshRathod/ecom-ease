import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const currentUser = useSelector((state) => state.currentUser);
  console.log(currentUser);

  return currentUser && !currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
