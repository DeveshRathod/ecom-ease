import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let settingUrl = "";
  if (currentUser && currentUser.isAdmin) {
    settingUrl = "/adminsetting";
  }

  if (currentUser && !currentUser.isAdmin) {
    settingUrl = "/setting";
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartCount = 5;
  const wishlistCount = 3;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="nav flex p-4 sm:p-8 justify-between items-center bg-[#FFBE98] sticky">
      <Link to="/" className="text-xs sm:text-xl">
        <h1>ShopEase</h1>
      </Link>
      <div className="bg-[#FEECE2] rounded-md flex items-center">
        <div className="p-2">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search....."
          className="w-24 sm:w-36 md:w-48 shadow-inner outline-none p-2 bg-inherit rounded-md text-sm sm:text-base black"
        />
      </div>
      <div className="flex items-center gap-2 sm:gap-8">
        {token && currentUser && currentUser.isAdmin && (
          <div>
            <Link to="/dashboard">
              <DashboardRoundedIcon />
            </Link>
          </div>
        )}
        {token && currentUser && !currentUser.isAdmin && (
          <div className="flex justify-center items-center gap-2 sm:gap-8">
            <Link>
              <div className="relative">
                <FavoriteIcon />
                {wishlistCount > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                    {wishlistCount}
                  </div>
                )}
              </div>
            </Link>
            <Link to="/cart">
              <div className="relative">
                <ShoppingCartIcon />
                {cartCount > 0 && (
                  <div className="absolute top-3 right-3 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                    {cartCount}
                  </div>
                )}
              </div>
            </Link>
          </div>
        )}
        <div className="relative flex">
          {token && currentUser ? (
            <>
              <button onClick={toggleDropdown}>
                <img
                  src={currentUser.profile}
                  alt="profle"
                  className="w-8 h-8 object-cover rounded-full self-center"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-[#FEECE2] rounded-md shadow-md transition ease-in-out">
                  <ul className="p-4 flex flex-col gap-2">
                    <li
                      className={`${!currentUser.isAdmin ? "block" : "hidden"}`}
                    >
                      <Link>Orders</Link>
                    </li>
                    <li>
                      <Link to={settingUrl}>Settings</Link>
                    </li>
                    <li>
                      <button
                        className=" text-red-500 flex justify-center items-center gap-2"
                        onClick={logout}
                      >
                        <div>
                          <LogoutIcon />
                        </div>
                        <div>Logout</div>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <Link
                  to="/signin"
                  className="p-2 rounded-md bg-[#FFBE98] text-md"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
