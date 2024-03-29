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
  }, [setFrom, from]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
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
      <div className="p-4 flex justify-between">
        <div className="bg-gray-100 flex gap-1 items-center rounded-md p-2">
          <SearchIcon />
          <input
            type="text"
            className="outline-none bg-gray-100 w-full"
            placeholder=" Search...."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
        {from && <AddNew setForm={setFrom} setItems={setItems} />}
        <div>
          <button
            className="flex items-center justify-between rounded-md bg-gray-100 py-2 px-6"
            onClick={() => setFrom(true)}
          >
            <AddIcon />
            <p>Add</p>
          </button>
        </div>
      </div>

      <div className="pl-2 pr-2 pb-2 sm:pl-4 sm:pr-4 sm:pb-4 h-[calc(100vh - 9rem)]">
        <div className="pt-4 pb-4 pl-8 bg-gray-100 rounded-t-md">
          <select
            name=""
            id=""
            className="p-2 outline-none rounded-md"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            <option value="Furniture">Furniture</option>
            <option value="Mobile">Mobiles</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Travels">Travels</option>
            <option value="Toys">Toys</option>
          </select>
        </div>
        <div className="h-full overflow-y-auto rounded-b-md">
          <div className="w-full bg-gray-100 flex flex-col">
            <div className="flex justify-center gap-2 pb-10">
              <div className="flex flex-wrap w-full p-2 justify-center  gap-2">
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
    </DashboardLayout>
  );
};

export default Items;
