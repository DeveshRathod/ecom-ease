import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const SettingsWrapper = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:4000/api/user/getcount",
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      setCartCount(response.data.cart);
      setNotificationCount(response.data.notification);
    };

    fetch();
  }, []);
  return (
    <div className=" min-h-fit">
      <Navbar cartCount={cartCount} notificationCount={notificationCount} />
      {children}
      <Footer />
    </div>
  );
};

export default SettingsWrapper;
