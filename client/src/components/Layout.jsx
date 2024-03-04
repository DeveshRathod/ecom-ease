import React from "react";
import Navbar from "./Navbar";
import NavSlider from "./NavSlider";

const Layout = ({ childern }) => {
  return (
    <div>
      <Navbar />
      <NavSlider />
      {childern}
    </div>
  );
};

export default Layout;
