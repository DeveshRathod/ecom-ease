import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { data } from "../data/category.js";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

export default function Category() {
  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 ml-4">
        <div className="swiper-button-prev bg-white p-2 rounded-full text-black hover:text-white hover:bg-black cursor-pointer transition duration-200 ease-in-out">
          <WestIcon />
        </div>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 mr-4">
        <div className="swiper-button-next bg-white p-2 rounded-full text-black hover:text-white hover:bg-black cursor-pointer transition duration-200 ease-in-out">
          <EastIcon />
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="mySwiper"
      >
        {data.map((category, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="overflow-hidden rounded-lg h-full relative">
              <img
                src={category.image}
                alt={category.name}
                className="w-76 h-80 object-cover transition duration-500 transform hover:scale-110"
              />
              <Link
                to="#"
                className="absolute inset-x-20 bottom-2 bg-white p-2 text-black group rounded-full text-center text-sm ease-in-out flex items-center justify-center hover:text-white hover:bg-black"
              >
                <div>{category.name}</div>
                <div className="hidden group-hover:flex">
                  <ArrowOutwardIcon sx={{ fontSize: 20 }} />
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
