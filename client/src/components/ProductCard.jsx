import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleImageChange = (index, e) => {
    setSelectedImageIndex(index);
    e.stopPropagation();
  };

  return (
    <div key={product._id} className="relative">
      <Link
        to={`/product/${product._id}/${selectedImageIndex}`}
        className="block"
      >
        <div
          className="w-42 h-80 overflow-hidden rounded-md"
          onMouseEnter={() =>
            setHoverTimeout(setTimeout(() => setIsHovered(true), 500))
          }
          onMouseLeave={() => {
            clearTimeout(hoverTimeout);
            setIsHovered(false);
          }}
        >
          <img
            id={`product_${product._id}`}
            src={
              isHovered && product.images[selectedImageIndex].images[1]
                ? product.images[selectedImageIndex].images[1].url
                : product.images[selectedImageIndex].images[0].url
            }
            alt={product.name}
            className="w-full h-full object-contain transition duration-1000 transform hover:scale-105"
          />
        </div>
        <div className="bg-white p-4 w-42">
          <h2 className="text-base mb-2">
            {product.name} ({product.images[selectedImageIndex].name})
          </h2>
          <p className="text-gray-700 text-base">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </Link>
      <div className=" flex">
        <div className=" flex justify-start pl-4 gap-2 w-full">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`rounded-full w-6 h-6 border-2 ${
                index === selectedImageIndex ? "border-gray-500 p-2" : ""
              }`}
              style={{ backgroundColor: image.color }}
              onClick={(e) => handleImageChange(index, e)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
