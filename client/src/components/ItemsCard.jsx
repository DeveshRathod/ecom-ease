import React from "react";
import InventoryIcon from "@mui/icons-material/Inventory";

const ItemsCard = ({ item }) => {
  return (
    <div className="relative flex flex-col items-center p-4 bg-white shadow-md rounded-lg w-60 h-70 overflow-hidden ">
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-full h-40 object-contain mb-4"
      />
      <div className=" flex flex-col w-full items-center gap-4">
        <div className=" text-md font-semibold">{item.name}</div>
        <div className=" flex w-full justify-between items-start">
          <div className="text-gray-600 mb-2">Rs.{item.price}</div>
          <div className="text-gray-600 flex items-center justify-center mb-2 gap-1">
            <div>
              <InventoryIcon sx={{ fontSize: 16 }} />
            </div>
            <div>{item.stock}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsCard;
