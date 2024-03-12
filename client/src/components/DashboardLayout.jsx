import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import Exit from "./Exit";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const currentUser = useSelector((state) => state.currentUser);
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-[#F7DED0] font-family-karla flex">
      <aside className="relative bg-[#FFBE98] h-screen w-64 hidden sm:block shadow-xl">
        <div className="p-6 ">
          <h1 className="text-white text-3xl font-semibold uppercase overflow-hidden whitespace-nowrap overflow-ellipsis">
            {currentUser.username}
          </h1>
        </div>
        <nav className="text-white text-base font-semibold pt-3">
          <Link
            to="/dashboard"
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item"
          >
            Home
          </Link>
          <Link
            to="/items"
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            Items
          </Link>
          <Link
            to="/users"
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            Users
          </Link>
          <Link
            to="/orders"
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
          >
            Orders
          </Link>
        </nav>
        <button
          className="flex items-center text-red-500 py-4 pl-6"
          onClick={() => setShowModal(true)}
        >
          Exit
        </button>
      </aside>
      <div>
        {showModal && (
          <Exit
            setShowModal={handleModalClose}
            message={"All unsaved data will be lost"}
          />
        )}
      </div>

      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <header className="w-full items-center bg-[#FFBE98] py-2 px-6 hidden sm:flex">
          <div className="w-1/2">
            {isSidebarOpen && (
              <div onClick={toggleSidebar} className="fixed inset-0"></div>
            )}
          </div>
          <div className="relative w-1/2 flex justify-end">
            <div
              onClick={toggleSidebar}
              className="relative z-10 w-8 h-8 rounded-full m-2 overflow-hidden"
            >
              <img src={currentUser.profile} alt="profile" />
            </div>
          </div>
        </header>

        <header className="w-full bg-[#FFBE98] py-5 px-6 sm:hidden">
          <div className="flex items-center justify-between ">
            <h1 className="text-white text-3xl font-semibold uppercase overflow-hidden whitespace-nowrap overflow-ellipsis">
              {currentUser.username}
            </h1>
            <button
              onClick={toggleSidebar}
              className="text-white text-3xl focus:outline-none"
            >
              <MenuIcon />
            </button>
          </div>

          <nav className={isSidebarOpen ? "flex flex-col pt-4" : "hidden"}>
            <Link
              to="/dashboard"
              className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
            >
              Home
            </Link>
            <Link
              to="/items"
              className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
            >
              Items
            </Link>

            <Link
              to="/users"
              className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
            >
              Users
            </Link>
            <Link
              to="/orders"
              className="flex items-center text-white opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
            >
              Orders
            </Link>

            <button
              className=" flex items-center text-red-500 py-2 pl-4 "
              onClick={() => setShowModal(true)}
            >
              Exit
            </button>
          </nav>
        </header>

        <div className="w-full overflow-x-hidden flex flex-col bg-[#F7DED0]">
          <main className="w-full flex-grow  bg-[#F7DED0]">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
