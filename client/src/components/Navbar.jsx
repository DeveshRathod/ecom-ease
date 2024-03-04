import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { useSelector } from "react-redux";

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const token = localStorage.getItem("token");

  const cartCount = 5;
  const wishlistCount = 3;

  return (
    <div className="nav flex p-4 sm:p-8 justify-between items-center bg-[#FFBE98] ">
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
          className="w-24 sm:w-36 md:w-48 shadow-inner outline-none p-2 bg-inherit rounded-md text-sm sm:text-base"
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
        <div>
          {token && currentUser ? (
            <>
              <div>
                <img
                  src={currentUser.profile}
                  alt="profle"
                  className=" w-8 object-contain rounded-full"
                />
              </div>
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
