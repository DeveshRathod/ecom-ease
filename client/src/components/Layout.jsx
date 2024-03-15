import React from "react";
import Navbar from "./Navbar";

const SettingsWrapper = ({ children }) => {
  return (
    <div className=" min-h-fit">
      <Navbar />
      {children}
    </div>
  );
};

export default SettingsWrapper;
