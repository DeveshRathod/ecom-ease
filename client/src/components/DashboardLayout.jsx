import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import Dialog from "./Dialog";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const currentUser = useSelector((state) => state.currentUser);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const dialogFun = () => {
    setShowModal(false);
    navigate("/");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white flex">
      <aside className="relative bg-white h-screen w-52 hidden sm:block shadow-xl">
        <div className="p-6 ">
          <Link
            to="/dashboard"
            className="text-black text-3xl font-semibold uppercase overflow-hidden whitespace-nowrap overflow-ellipsis"
          >
            {currentUser.username}
          </Link>
        </div>
        <nav className=" text-base font-semibold pt-3">
          <NavLink
            to="/dashboard"
            className="flex items-center py-4 pl-6 nav-item"
            activeclassname="active"
          >
            Home
          </NavLink>
          <NavLink
            to="/items"
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
            activeclassname="active"
          >
            Items
          </NavLink>
          <NavLink
            to="/users"
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
            activeclassname="active"
          >
            Users
          </NavLink>
          <NavLink
            to="/orders"
            className="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item"
            activeclassname="active"
          >
            Orders
          </NavLink>
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
          <Dialog
            setShowModal={handleModalClose}
            headline={"Are you sure you want to exit?"}
            message={"All unsaved data will be lost"}
            dialogFun={dialogFun}
            showModel={showModal}
          />
        )}
      </div>

      <div className="w-full flex flex-col h-screen overflow-y-hidden">
        <header className="w-full bg-white py-2 px-3 sm:hidden shadow-lg">
          <div className="flex items-center justify-between ">
            <h1 className="text-black text-xl font-semibold uppercase overflow-hidden whitespace-nowrap overflow-ellipsis">
              {currentUser.username}
            </h1>
            <button
              onClick={toggleSidebar}
              className="text-black text-3xl focus:outline-none"
            >
              <MenuIcon />
            </button>
          </div>

          <nav className={isSidebarOpen ? "flex flex-col pt-4" : "hidden"}>
            <NavLink
              to="/dashboard"
              className="flex items-center text-black py-2 pl-4 nav-item"
              activeclassname="active"
            >
              Home
            </NavLink>
            <NavLink
              to="/items"
              className="flex items-center text-black opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              activeclassname="active"
            >
              Items
            </NavLink>

            <NavLink
              to="/users"
              className="flex items-center text-black opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              activeclassname="active"
            >
              Users
            </NavLink>
            <NavLink
              to="/orders"
              className="flex items-center text-black opacity-75 hover:opacity-100 py-2 pl-4 nav-item"
              activeclassname="active"
            >
              Orders
            </NavLink>

            <button
              className="flex items-center text-red-500 py-2 pl-4 "
              onClick={() => setShowModal(true)}
            >
              Exit
            </button>
          </nav>
        </header>

        <div className="w-full overflow-x-hidden flex flex-col bg-[#F7DED0]">
          <main className="w-full flex-grow  bg-white">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
