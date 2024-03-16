import React from "react";

const Address = ({ address }) => {
  return (
    <div className=" flex p-2 rounded-md bg-white shadow-md">
      <div className=" flex-1">
        <div className=" flex">
          <p>{address.addressLine1},</p>
          <p>{address.addressLine2}</p>
        </div>
        <div className=" flex">
          <p>{address.addressLine3},</p>
          <p>{address.pincode}</p>
        </div>
      </div>
      <div className=" flex-1 flex">
        <button className=" py-2 px-6">He</button>
      </div>
    </div>
  );
};

export default Address;
