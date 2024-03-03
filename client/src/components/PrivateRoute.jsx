import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const currentUser = {
    isAdmin: true,
    name: "admin",
    email: "email@admin.com",
  };

  return currentUser && !currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
