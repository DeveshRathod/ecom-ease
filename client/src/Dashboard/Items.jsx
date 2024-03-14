import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddNew from "../components/AddProduct";
import axios from "axios";
import ItemsCard from "../components/ItemsCard";

const Items = () => {
  const [from, setFrom] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/admin/getAllProduct",
            {
              headers: {
                authorization: `${token}`,
              },
            }
          );

          const products = response.data;
          setItems(products);
          setFilteredItems(products);
        } catch (error) {
          console.log(error);
        }
      } else {
        localStorage.setItem("token", "");
        window.location.reload();
      }
    };

    fetch();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    const category = event.target.value;
    const filtered = category
      ? items.filter((item) => item.category === category)
      : items;
    setFilteredItems(filtered);
  };

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex p-2 sm:p-4 justify-evenly sm:justify-between">
          <div>
            <div className="p-2 bg-[#FEECE2] flex gap-1 items-center rounded-md">
              <SearchIcon />
              <input
                type="text"
                className="p-1 outline-none bg-[#FEECE2] black"
                placeholder=" Search...."
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </div>
          </div>
          {from && (
            <div>
              <AddNew setForm={setFrom} setItems={setItems} />
            </div>
          )}

          <div>
            <button
              className="flex items-center rounded-md bg-[#FEECE2] p-3"
              onClick={() => setFrom(true)}
            >
              <AddIcon />
              <p className="bg-[#FEECE2]">Add New</p>
            </button>
          </div>
        </div>

        <div className="pl-2 pr-2 pb-2 sm:pl-4 sm:pr-4 sm:pb-4 h-[84vh] sm:h-[82vh] overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="w-full bg-[#FEECE2] flex flex-col h-screen">
              <div className="pt-4 pb-4 pl-8">
                <select
                  name=""
                  id=""
                  className="p-2 outline-none rounded-md"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Mobile">Mobiles</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Travels">Travels</option>
                  <option value="Toys">Toys</option>
                </select>
              </div>
              <div className="flex justify-center gap-2 p-2 overflow-x-auto max-w-screen">
                <div className=" flex flex-wrap w-fit p-2 overflow-x-auto justify-start gap-2">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, id) => (
                      <ItemsCard item={item} key={id} />
                    ))
                  ) : (
                    <div>No data</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Items;
