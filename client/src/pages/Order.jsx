import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/user/getAddress",
            {
              headers: {
                authorization: `${token}`,
              },
            }
          );
          setAddresses(response.data);
          if (response.data.length > 0) {
            setSelectedAddress(response.data[0]._id);
          }
        } catch (error) {
          console.error("Failed to fetch addresses", error);
          navigate("/signin");
        }
      } else {
        navigate("/signin");
      }
    };

    fetchAddress();
  }, [navigate]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePlaceOrder = () => {
    // Handle place order logic here
    console.log("Order placed with:", {
      address: selectedAddress,
      paymentMethod: selectedPaymentMethod,
    });
  };

  return (
    <Layout>
      <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full">
        <div className="w-full sm:w-1/2 pr-3">
          <h2 className="text-lg font-semibold mb-4">Payment Options</h2>

          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            onChange={handlePaymentMethodChange}
            checked={selectedPaymentMethod === "cod"}
            className="hidden"
          />
          <label htmlFor="cod" className="w-full block mb-4 cursor-pointer">
            <div className="p-4 border rounded">
              <div>Cash on Delivery</div>
              {selectedPaymentMethod === "cod" && (
                <div className="mt-2 p-4 border rounded shadow-inner bg-gray-100">
                  <p className="text-gray-600">
                    You will pay with cash upon delivery.
                  </p>
                </div>
              )}
            </div>
          </label>
          <input
            type="radio"
            id="stripe"
            name="paymentMethod"
            value="stripe"
            onChange={handlePaymentMethodChange}
            checked={selectedPaymentMethod === "stripe"}
            className="hidden"
          />
          <label htmlFor="stripe" className="w-full block mb-4 cursor-pointer">
            <div className="p-4 border rounded">
              <div>Stripe</div>
              {selectedPaymentMethod === "stripe" && (
                <div className="mt-2 p-4 border rounded shadow-inner bg-gray-100">
                  <p className="text-gray-600">
                    You will be redirected to Stripe to complete your payment.
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="w-full sm:w-1/2 pl-3">
          <div className="">
            <h2 className="text-lg font-semibold mb-4">
              Select Delivery Address
            </h2>
            {addresses.length > 0 ? (
              <div className="overflow-auto max-h-[420px]">
                {addresses.map((address) => (
                  <div key={address._id} className="w-full mb-3">
                    <input
                      type="radio"
                      id={address._id}
                      name="address"
                      value={address._id}
                      onChange={handleAddressChange}
                      checked={selectedAddress === address._id}
                      className="hidden"
                    />
                    <label
                      htmlFor={address._id}
                      className="w-full block cursor-pointer"
                    >
                      <div
                        className={`border p-4 rounded ${
                          selectedAddress === address._id ? "border-black" : ""
                        }`}
                      >
                        <button className="bg-gray-200 text-gray-600 rounded-sm mb-2">
                          {address.type}
                        </button>
                        <div className="flex justify-start">
                          <div className="flex justify-center items-center gap-5">
                            <h1 className="font-semibold">{address.name}</h1>
                            <p>{address.mobile}</p>
                          </div>
                        </div>
                        <div className="pb-2">
                          <p>
                            {address.addressLine1}, {address.addressLine2},{" "}
                            {address.addressLine3} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No addresses available. Please add an address in your profile.
              </p>
            )}
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={handlePlaceOrder}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black hover:border border-black transition-all ease-in-out"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;
