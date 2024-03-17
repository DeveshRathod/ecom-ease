import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/admin/getUsers?searchquery=${searchQuery}&page=${currentPage}`,
            {
              headers: {
                authorization: `${token}`,
              },
            }
          );
          const data = response.data;
          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      } else {
        localStorage.setItem("token", "");
        window.location.reload();
      }
    };

    fetchUsers();
  }, [searchQuery, currentPage]);

  const getDate = (date) => {
    return date.slice(0, 10);
  };

  const handleDeleteUser = (userId) => {
    console.log("Deleting user with ID:", userId);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (users.length === 0) return;
    if (users.length < 11) return;

    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="p-3 flex justify-between">
        <div className="p-2 bg-gray-100 w-full md:w-1/2 lg:w-1/3 md:mr-2 flex gap-1 items-center rounded-md">
          <SearchIcon />
          <input
            type="text"
            className="outline-none bg-gray-100 w-full"
            placeholder="Search By Name/Email/Phone"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full min-h-[700px]">
        <table className="min-w-full divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Birthday
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-gray-200">
            {users.map((user) => (
              <tr key={user.email}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap flex">
                  <img
                    src={user.profile}
                    className="w-5 h-6 object-contain"
                    alt={user.username}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDate(user.birthday)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleDeleteUser(user._id)}>
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className=" ml-2"
                  >
                    <ZoomInIcon sx={{ fontSize: 20 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2">
        <button
          onClick={goToPrevPage}
          className="p-2  w-10 text-black flex justify-center"
        >
          <ChevronLeftIcon />
        </button>
        <div className="p-2  w-10 text-black flex justify-center">
          <p className="self-center">{currentPage}</p>
        </div>
        <button
          onClick={goToNextPage}
          className="p-2  w-10 text-black flex justify-center"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Users;
