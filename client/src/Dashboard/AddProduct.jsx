import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddImage from "../components/AddImage";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    specifications: "",
    stock: 0,
    brand: "",
    discount: 0,
    images: [],
    type: "all",
    sizes: "",
  });

  const [colorImage, setColorImage] = useState({
    id: "",
    name: "",
    color: "#000000",
    images: [],
  });

  const [allImages, setAllImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedForm = { ...formData, images: allImages };

    console.log(updatedForm);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(
          "http://localhost:4000/api/admin/addProduct",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(updatedForm),
          }
        );
        const data = await response.json();
        console.log(data);
        // Add logic to handle response from backend, e.g., show success message
      } catch (error) {
        console.error("Error uploading images:", error);
        // Add logic to handle errors, e.g., show error message to user
      }
    } else {
      alert("Please login first");
    }
  };

  const handleNameChange = (event) => {
    setColorImage((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleColorChange = (event) => {
    setColorImage((prevState) => ({
      ...prevState,
      color: event.target.value,
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!colorImage.name) {
      console.error("Name is required.");
      return;
    }
    const randomId = Math.floor(100000 + Math.random() * 900000);
    setAllImages([...allImages, { ...colorImage, id: randomId.toString() }]);
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12 p-4 sm:p-16">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Product Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Add product details
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Product Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Price
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Desciption
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    value={formData.description}
                    name="description"
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Category
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Category</option>
                    <option value="furniture">Furniture</option>
                    <option value="mobiles">Mobiles</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="travels">Travels</option>
                    <option value="toys">Toys</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Type
                </label>
                <div className="mt-2">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Type</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Choose Color
                </label>
                <div className="mt-2 flex justify-center items-center gap-6 flex-row">
                  <input
                    type="color"
                    className=" w-8 h-8 custom-color-input"
                    value={colorImage.color}
                    onChange={handleColorChange}
                  />

                  <input
                    type="text"
                    placeholder="Name"
                    value={colorImage.name}
                    onChange={handleNameChange}
                    className="block w-full rounded-md border-0 px-1 py-1 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                  <button
                    onClick={handleAdd}
                    className="py-2 px-4 rounded-md bg-gray-500 text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="sm:col-span-6">
                {allImages.length > 0 && (
                  <AddImage allImages={allImages} setAllImages={setAllImages} />
                )}
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Specifications
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="specifications"
                    id="specifications"
                    value={formData.specifications}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Stock
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Brand
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5  py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="discount"
                    id="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Available Sizes
                </label>
                <div className="mt-2">
                  <input
                    type="sizes"
                    name="sizes"
                    id="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 pl-4 pr-4 pb-4 sm:pl-16 sm:pr-16 sm:pb-16">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm "
          >
            Save
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AddProduct;
