import React from "react";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import BackpackIcon from "@mui/icons-material/Backpack";
import ToysIcon from "@mui/icons-material/Toys";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

const NavSlider = () => {
  return (
    <div className="w-full h-fit flex items-center sm:justify-evenly md:justify-evenly justify-start p-4 overflow-x-auto overflow-y-hidden bg-[#FEECE2] hide-scrollbar mt-2">
      <Link className="flex-none pr-8 flex items-center gap-1">
        <HomeIcon />
        <button>All</button>
      </Link>
      <Link className="flex-none pr-8 flex items-center gap-1">
        <ShoppingBasketIcon />
        <button>Grocery</button>
      </Link>
      <Link className="flex-none pr-8 flex items-center gap-1">
        <PhoneAndroidIcon />
        <button>Mobiles</button>
      </Link>
      <Link className="flex-none pr-8 flex items-center gap-1">
        <CheckroomIcon />
        <button>Fashion</button>
      </Link>
      <Link className="flex-none pr-8 flex items-center gap-1">
        <HeadphonesIcon />
        <button>Electronics</button>
      </Link>
      <Link className="flex-none pr-8 flex items-center gap-1">
        <BackpackIcon />
        <button>Travel</button>
      </Link>
      <Link className="flex-none pr-8 flex items-center gap-1">
        <ToysIcon />
        <button>Toys</button>
      </Link>
    </div>
  );
};

export default NavSlider;
