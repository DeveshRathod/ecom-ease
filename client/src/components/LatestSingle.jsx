import React from "react";

const LatestSingle = ({ product }) => {
  console.log(product);
  return (
    <section>
      <header>
        <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
          You might also like
        </h2>
      </header>

      <div className="mx-auto max-w-screen-xl py-6 px-4 sm:px-0">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="grid place-content-center rounded bg-gray-100 p-6 sm:p-8">
            <div className="mx-auto max-w-md text-center lg:text-left">
              <header>
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                  {product.category}
                </h2>

                <p className="mt-4 text-gray-500">{product.description}</p>
              </header>

              <a
                href="#"
                className="mt-8 inline-block rounded border border-gray-900 bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:shadow focus:outline-none focus:ring"
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
                    src={product.images[0]}
                    alt=""
                    className="aspect-square w-full rounded object-cover"
                  />
                </a>
              </li>

              <li>
                <a href="#" className="group block">
                  <img
                    src={product.images[1]}
                    alt=""
                    className="aspect-square w-full rounded object-cover"
                  />
                </a>
              </li>
              <div className="mt-3">
                <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                  {product.name} By {product.brand}
                </h3>

                <p className="mt-1 text-sm text-gray-700">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestSingle;
