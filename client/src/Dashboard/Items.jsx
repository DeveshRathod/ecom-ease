import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddNew from "../components/AddProduct";

const Items = () => {
  const [from, setFrom] = useState(false);
  return (
    <DashboardLayout>
      <div>
        <div className=" flex p-4 justify-between ">
          <div>
            <div className="p-2 bg-[#FFBE98] flex gap-1 items-center rounded-md">
              <SearchIcon />
              <input
                type="text"
                className=" p-1 outline-none bg-[#FFBE98]"
                placeholder=" Search...."
              />
            </div>
          </div>
          {from && (
            <div>
              <AddNew setForm={setFrom} />
            </div>
          )}

          <div>
            <button
              className=" flex items-center rounded-md bg-[#FFBE98] p-3 "
              onClick={() => setFrom(true)}
            >
              <AddIcon />
              <p className=" bg-[#FFBE98]">Add New</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Items;
