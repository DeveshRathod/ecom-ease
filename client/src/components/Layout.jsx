import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const SettingsWrapper = ({ children }) => {
  return (
    <div className=" min-h-fit">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default SettingsWrapper;
