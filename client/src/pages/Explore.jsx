import React, { useState } from "react";
import Layout from "../components/Layout";
import Search from "../components/Search";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  console.log(searchQuery);
  return (
    <Layout>
      <div className=" min-h-screen">
        <div className=" min-w-screen p-3 flex justify-center">
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
