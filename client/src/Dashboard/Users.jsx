import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const Users = () => {
  return (
    <DashboardLayout>
      <div className="p-2 sm:p-4 flex justify-between">
        <div className="p-2 bg-[#FEECE2] w-full md:w-1/2 lg:w-1/3 md:mr-2 flex gap-1 items-center rounded-md">
          <SearchIcon />
          <input
            type="text"
            className="p-1 outline-none bg-[#FEECE2] black w-full"
            placeholder="Search By Name/Email/Phone"
          />
        </div>
      </div>

      <div className="pl-2 pr-2 pb-2 sm:pl-4 sm:pr-4 sm:pb-4">Hello</div>
    </DashboardLayout>
  );
};

export default Users;
