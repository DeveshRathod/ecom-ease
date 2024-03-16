import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CarouselComp from "../components/CarouselComp";
import image from "../data/heroimag.jpeg";

const Home = () => {
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div>
      <div>
        <div className="h-full flex flex-col sm:flex-row items-center justify-center mt-20">
          <div className="flex-1 flex flex-col justify-center items-center sm:items-start text-center sm:text-left px-6 sm:px-0 ml-7">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 lg:mb-6 text-gray-800">
              Welcome to ShopEase
            </h1>
            <p className="text-lg mb-6 text-gray-600">
              Find everything you need with ease on ShopEase.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start">
              <Link
                to="/explore"
                className="bg-[#FFBE98] text-white px-6 py-3 border hover:border-[#FFBE98] rounded-md shadow-lg hover:bg-white hover:text-[#FFBE98] transition duration-300 ease-in-out mr-4 mb-4 sm:mb-0 flex justify-center items-center gap-2"
              >
                <div>
                  <SearchIcon />
                </div>
                <p>Explore</p>
              </Link>
              {currentUser && currentUser.isAdmin && (
                <Link
                  to="/dashboard"
                  className=" bg-transparent border border-[#FFBE98] text-[#FFBE98] px-6 py-3 rounded-md shadow-lg hover:bg-[#FFBE98] hover:text-white transition duration-300 ease-in-out mr-4 mb-4 sm:mb-0 flex justify-center items-center gap-2"
                >
                  <div>
                    <DashboardIcon />
                  </div>
                  <p>Dashboard</p>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 mt-10 sm:mt-0">
            <img
              src={image}
              alt="hero_image"
              className="w-5/6 sm:w-full h-auto md:h-full object-contain rounded-md shadow-lg"
            />
          </div>
        </div>
      </div>
      <div>
        <div className=" w-full flex justify-center flex-col pt-6 pb-6 mt-20 rounded-md gap-2">
          <div className="text-3xl self-center mb-6 font-semibold">
            Our Top Brands
          </div>
          <div className="h-fit min-w-screen bg-white self-center">
            <CarouselComp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
