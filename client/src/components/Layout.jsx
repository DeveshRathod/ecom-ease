import React from "react";
import Navbar from "./Navbar";

const Layout = ({ childern }) => {
  return (
    <div>
      <Navbar />
      {childern}
    </div>
  );
};

export default Layout;
