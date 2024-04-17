import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";

const Product = () => {
  const param = useParams();
  const { id, colorIndex } = param;
  console.log(id, colorIndex);
  return (
    <Layout>
      <div className=" sm:pl-20 pl-10 pr-10 sm:pr-20">Product</div>
    </Layout>
  );
};

export default Product;
