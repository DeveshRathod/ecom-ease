import React from "react";

const Authwrapper = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-white flex flex-col md:flex-row auth">
      <div className="hidden md:flex md:flex-1 justify-center items-center">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/ecom-ease.appspot.com/o/authimage.png?alt=media&token=e3a0db60-3bd1-42f3-9815-e085cd24e7b4"
          alt="hero_image"
          className="w-1/2 h-auto md:w-full md:h-full object-contain"
        />
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-fit h-fit md:h-auto rounded-md p-8 md:p-4 shadow-md bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Authwrapper;
