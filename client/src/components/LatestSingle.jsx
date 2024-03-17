import axios from "axios";
import React, { useEffect, useState } from "react";

const LatestSingle = () => {
  const [product, setproduct] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/products/newarrivals"
        );
        const latestData = await response.data;
        setproduct(latestData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLatest();
  }, []);

  console.log(product[4]);

  return (
    <section>
      {product.length >= 5 && (
        <div>
          <header>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              You might also like
            </h2>
          </header>

          <div className="mx-auto max-w-screen-xl mt-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
              <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
                <div className="mx-auto max-w-md text-center lg:text-left">
                  <header>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                      {product[4].category}
                    </h2>

                    <p className="mt-4 text-gray-500">
                      {product[4].description}
                    </p>
                  </header>

                  <a
                    href="#"
                    className="bg-white text-black w-full px-8 py-3 border border-black hover:border-black rounded-md  hover:bg-black hover:text-white transition duration-300 ease-in-out mt-8 flex justify-center items-center gap-2"
                  >
                    Shop All
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2 lg:py-8">
                <ul className="grid grid-cols-2 gap-4">
                  <li>
                    <a href="#" className="group block">
                      <img
                        src={product[4].images[0]}
                        alt=""
                        className="aspect-square w-full rounded object-cover"
                      />
                    </a>
                  </li>

                  <li>
                    <a href="#" className="group block">
                      <img
                        src={product[4].images[1]}
                        alt=""
                        className="aspect-square w-full rounded object-cover"
                      />
                    </a>
                  </li>
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                      {product[4].name} By {product[4].brand}
                    </h3>

                    <p className="mt-1 text-sm text-gray-700">
                      ₹{product[4].price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LatestSingle;
