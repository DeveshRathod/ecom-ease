import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Carousel from "../components/Carousel";
import Category from "../components/Category";
import image from "../data/heroimag.jpeg";
import Latest from "../components/Latest";
import Footer from "../components/Footer";
import LatestSingle from "../components/LatestSingle";

const Home = () => {
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <div>
      {/* Header */}

      <div>
        <div className="h-full flex flex-col sm:flex-row items-center justify-center mt-20">
          <div className="flex-1 flex flex-col justify-center items-center text-center sm:text-left px-6 sm:px-0 ml-0 sm:ml-7">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 lg:mb-6 text-gray-800">
                Welcome to ShopEase
              </h1>
              <p className="text-lg mb-6 text-gray-600">
                Find everything you need with ease on ShopEase.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start">
                <Link
                  to="/explore"
                  className="bg-white text-black px-8 py-3 border border-black hover:border-black rounded-md  hover:bg-black hover:text-white transition duration-300 ease-in-out mr-4 mb-4 sm:mb-0 flex justify-center items-center gap-1"
                >
                  <div>
                    <SearchIcon />
                  </div>
                  <p>Explore</p>
                </Link>
                {currentUser && currentUser.isAdmin && (
                  <Link
                    to="/dashboard"
                    className=" bg-black border border-black text-white px-8 py-3 rounded-md hover:bg-white hover:text-black transition duration-300 ease-in-out mr-4 mb-4 sm:mb-0 flex justify-center items-center gap-2"
                  >
                    <div>
                      <DashboardIcon />
                    </div>
                    <p>Dashboard</p>
                  </Link>
                )}
              </div>
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

      {/* Categories Section */}

      <div className="w-full mt-10 flex justify-center items-center">
        <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12 sm:px-0 py-4">
          <div className="text-xl font-bold text-gray-900 sm:text-3xl text-center mt-2 mb-5">
            Categories you might like
          </div>
          <div className="bg-white w-full h-full">
            <Category />
          </div>
        </div>
      </div>

      {/* New Arrivals */}

      <div className="w-full mt-10 flex justify-center items-center">
        <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12 sm:px-0 py-4">
          <div className="bg-white w-full h-full">
            <Latest />
          </div>
        </div>
      </div>

      {/* New Launched */}

      <div className="w-full mt-10 flex justify-center items-center">
        <div className="w-full max-w-screen-xl mx-auto px-6 md:px-12 sm:px-0 py-4">
          <div className="bg-white w-full h-full">
            <LatestSingle />
          </div>
        </div>
      </div>

      {/* Brands */}

      <div className=" w-full flex justify-center flex-col pt-6 pb-6 mt-10 rounded-md gap-2">
        <div className="text-3xl self-center mb-6 font-semibold">
          Our Top Brands
        </div>
        <div className="h-fit min-w-screen bg-white self-center">
          <Carousel />
        </div>
      </div>

      {/* Footer */}

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
