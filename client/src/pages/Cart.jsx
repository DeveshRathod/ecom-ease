import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addBilling, addProducts } from "../store/reducers/order.slice";
import CartImage from "../data/images/cart.svg";
import { setCart } from "../store/reducers/cart.slice";

const calculateDiscountedPrice = (price, discount) => {
  return ((price * (100 - discount)) / 100).toFixed(2) * 1;
};

const calculateDiscountAmount = (price, discountedPrice) => {
  return (price - discountedPrice).toFixed(2) * 1;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [discountedTotalAmount, setDiscountedTotalAmount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:4000/api/products/getCart",
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );
        setCartItems(response.data);
        if (response.data.length === 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
        }
      } catch (error) {
        setIsEmpty(false);
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
      const totalDiscount = cartItems.reduce(
        (acc, item) => acc + (item.price * item.discount) / 100,
        0
      );
      const discountedTotalAmount = totalPrice - totalDiscount;
      const deliveryCharges = discountedTotalAmount >= 500 ? 0 : 40;
      const totalAmount = discountedTotalAmount + deliveryCharges;

      setTotalPrice(totalPrice);
      setTotalDiscount(totalDiscount);
      setDiscountedTotalAmount(discountedTotalAmount);
      setDeliveryCharges(deliveryCharges);
      setTotalAmount(totalAmount);
    }
  }, [cartItems]);

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

  const handleRemoveFromCart = async (productId, colorIndex) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `http://localhost:4000/api/products/deleteCart`,
        { productId, colorIndex },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );

      const updatedCartItems = [];
      let found = false;

      cartItems.forEach((item) => {
        if (
          !found &&
          item.productId === productId &&
          item.colorIndex === colorIndex
        ) {
          found = true;
        } else {
          updatedCartItems.push(item);
        }
      });

      if (updatedCartItems.length === 0) {
        setIsEmpty(true);
      }

      setCartItems(updatedCartItems);
      dispatch(setCart(updatedCartItems));
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
    }
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  console.log(addresses);

  const proceedPayment = () => {
    const totalBillingInfo = {
      totalAmount,
      deliveryCharges,
      discountedPrice: discountedTotalAmount,
      discountAmount: totalDiscount,
    };
    dispatch(addBilling(totalBillingInfo));
    dispatch(addProducts(cartItems));
  };

  if (!cartItems) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      {!isEmpty ? (
        <div className="flex flex-col sm:flex-row w-full pl-10 pr-10 pt-10">
          {/* Left Section: Cart Items */}
          <div className="flex-1 p-4 m-2 border rounded-lg overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
            <div className="flex flex-col max-h-[580px] overflow-auto">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start mb-4 p-2 relative"
                >
                  <img
                    src={item.image}
                    to={`/product/${item.productId}/${item.colorIndex}`}
                    alt={item.name}
                    className="w-20 h-20 mr-4 sm:w-24 sm:h-24"
                  />
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold">
                        {item.name} ({item.colorName})
                      </h2>
                      <p className="text-gray-600 text-xs">by {item.brand}</p>
                      {item.stock - item.sold <= 5 && (
                        <p className="text-red-500 text-xs">
                          Only {item.stock - item.sold} left
                        </p>
                      )}
                    </div>
                    <div className="flex justify-start items-center mt-2">
                      <p className="text-xs sm:text-lg">
                        {calculateDiscountedPrice(item.price, item.discount)}
                      </p>
                      {item.discount !== 0 && (
                        <p className="text-gray-500 line-through text-xs pl-3">
                          {item.price}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 cursor-pointer sm:hidden">
                    <RemoveCircleIcon
                      onClick={() =>
                        handleRemoveFromCart(item.productId, item.colorIndex)
                      }
                    />
                  </div>
                  <div className="absolute top-0 left-0 cursor-pointer hidden sm:block">
                    <RemoveCircleIcon
                      onClick={() =>
                        handleRemoveFromCart(item.productId, item.colorIndex)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Address Selection and Billing Info */}
          <div className="flex-1 p-4 m-2 border rounded-lg max-w-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Select Delivery Address
              </h2>
              <div className="max-h-64 overflow-auto border border-gray-200 rounded-md p-2">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
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
                            selectedAddress === address._id
                              ? "border-blue-500"
                              : ""
                          } hover:border-blue-500 transition duration-200`}
                        >
                          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-sm mb-2">
                            {address.type}
                          </button>
                          <div className="flex justify-between items-center">
                            <h1 className="font-semibold">{address.name}</h1>
                            <p>{address.mobile}</p>
                          </div>
                          <p className="text-xs text-gray-700 mt-2">
                            {address.addressLine1}, {address.addressLine2},{" "}
                            {address.addressLine3}, {address.pincode}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))
                ) : (
                  <div>No addresses found. Please add an address.</div>
                )}
              </div>
            </div>

            {/* Billing Info Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Billing Info</h2>
              <div className="text-sm mb-4 space-y-2">
                <div className="flex justify-between">
                  <p>Total Price:</p>
                  <p className="font-medium">{totalPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p>Total Discount:</p>
                  <p className="text-red-500">-{totalDiscount}</p>
                </div>
                <div className="flex justify-between">
                  <p>Delivery Charges:</p>
                  <p className="font-medium">{deliveryCharges}</p>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <p>Total Amount:</p>
                  <p className="text-blue-600">Rs.{totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <button
                className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
                onClick={proceedPayment}
              >
                Proceed to Payment
              </button>
              <p className="text-center my-4">Or</p>
              <button
                className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded hover:bg-green-700"
                onClick={proceedPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full justify-center">
          <div className=" w-full h-fit flex justify-center items-center flex-col gap-5 border bg-gray-50 pt-6 pb-10 rounded-md">
            <img
              src={CartImage}
              alt="empty_cart"
              className=" w-full h-full md:w-full md:h-full lg:w-1/3 lg:h-1/3 sm:w-1/3 sm:h-1/3 p-5"
            />
            <p className=" text-2xl sm:text-3xl mt-10">Your cart is empty!</p>
            <Link
              to="/explore/all"
              className=" px-6 py-2 bg-black text-white rounded-md"
            >
              Explore
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
