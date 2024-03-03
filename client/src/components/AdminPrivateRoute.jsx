import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateRoute = () => {
  const currentUser = {
    isAdmin: false,
  };
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default AdminPrivateRoute;
