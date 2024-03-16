import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase";

function AddNew({ setForm, setItems }) {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [file, setFile] = useState([]);
  const [filePerc, setFilePerc] = useState(null);

  const fileRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    specification: "",
    images: [],
    category: "",
    brand: "",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFile(selectedFiles);
  };

  const handleFileUpload = (files) => {
    const storage = getStorage(app);
    const folderName = "images";
    const uploadPromises = [];

    files.forEach((file) => {
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `${folderName}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const uploadPromise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePerc(Math.round(progress));
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((url) => {
                setFormData((prevData) => ({
                  ...prevData,
                  images: [...prevData.images, url],
                }));
                resolve();
              })
              .catch((error) => {
                reject(error);
              });
          }
        );
      });

      uploadPromises.push(uploadPromise);
    });

    Promise.all(uploadPromises)
      .then(() => {
        setFile([]);
        setFilePerc(null);
      })
      .catch((error) => {
        setErrorMessage("Image upload failed");
        setShowModal(true);
        console.error("Error uploading images:", error);
      });
  };

  useEffect(() => {
    if (file.length > 0) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:4000/api/admin/addProduct",
        formData,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      const data = await response.data;
      console.log(data);
      setItems(data);
      setForm(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowModal(true);
      console.error("Error adding product:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full h-full overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Add New Product
        </h1>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-gray-800 mb-1"
          >
            Product Name
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
            placeholder="Product Name"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-bold text-gray-800 mb-1"
            >
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
              placeholder="Brand"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-bold text-gray-800 mb-1"
            >
              Price
            </label>
            <input
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
              placeholder="Price"
            />
          </div>
        </div>
        <div>
          {showModal && (
            <Message
              message={errorMessage}
              setShowModal={setShowModal}
              showModel={showModal}
              isError={true}
            />
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-bold text-gray-800 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
            placeholder="Description"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="specification"
            className="block text-sm font-bold text-gray-800 mb-1"
          >
            Specifications
          </label>
          <input
            id="specification"
            name="specification"
            value={formData.specification}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
            placeholder="Specifications"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label
            htmlFor="images"
            className="block text-sm font-bold text-gray-800 mb-1"
          >
            Images
          </label>
          <input
            id="images"
            name="images"
            type="file"
            onChange={handleFileChange}
            ref={fileRef}
            className="hidden"
            multiple
          />
          <button
            onClick={() => fileRef.current.click()}
            className="w-full px-3 py-2 rounded bg-[#FFBE98] text-white"
          >
            Choose Images
          </button>
          <div className=" min-h-6 self-end pr-2">
            {filePerc !== null && filePerc < 100 ? (
              <>Uploading {filePerc}%</>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-bold text-gray-800 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
          >
            <option value="">Select</option>
            <option value="Grocery">Grocery</option>
            <option value="Mobile">Mobiles</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Travels">Travels</option>
            <option value="Toys">Toys</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-sm font-bold text-gray-800 mb-1"
          >
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            type="number"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-[#FFBE98]"
            placeholder="Stock"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setForm(false)}
            className="px-4 py-2 text-gray-600 rounded outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white rounded bg-[#FFBE98]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNew;
