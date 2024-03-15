import React from "react";
import data from "../data/brands.json";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";

const CarouselComp = () => {
  return (
    <div className=" w-full">
      <Marquee direction="left" speed={20}>
        {data.map((item, index) => (
          <div key={index}>
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-20 object-contain shadow-lg mr-4"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default CarouselComp;
