import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { useSelector } from "react-redux";

const Navbar = () => {
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div className="nav flex p-4 sm:p-8 justify-between items-center bg-[#FFBE98] ">
      <Link to="/" className="text-xs sm:text-xl">
        <h1>Ecom Ease</h1>
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
      <div className="flex items-center gap-2 sm:gap-4">
        {currentUser && currentUser.isAdmin && (
          <div>
            <Link to="/dashboard">
              <DashboardRoundedIcon />
            </Link>
          </div>
        )}
        {currentUser && !currentUser.isAdmin && (
          <div className="flex justify-center items-center gap-2 sm:gap-4">
            <Link>
              <FavoriteIcon />
            </Link>
            <Link to="/cart">
              <ShoppingCart />
            </Link>
          </div>
        )}
        <div>
          {currentUser ? (
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
                  className="p-2 rounded-md bg-[#FFBE98] text-sm"
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
