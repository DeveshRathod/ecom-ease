import React from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartImage from "../data/images/cart.svg";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { setCart } from "../store/reducers/cart.slice";

const Cart = () => {
  const cart = useSelector((state) => state.current.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = async (productId, colorIndex) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:4000/api/products/deleteCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify({ productId, colorIndex }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      const itemIndex = cart.findIndex(
        (item) => item.productId === productId && item.colorIndex === colorIndex
      );

      if (itemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart.splice(itemIndex, 1);
        dispatch(setCart(updatedCart));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
    }
  };

  const cartItems = Array.isArray(cart) ? cart : [];

  let totalPrice = 0;
  if (cartItems.length > 0) {
    totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  let totalDiscount = 0;
  if (cartItems.length > 0) {
    totalDiscount = cartItems.reduce(
      (acc, item) => acc + (item.price * item.discount) / 100,
      0
    );
  }
  const discountedPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  let discountedTotalAmount = totalPrice - totalDiscount;

  let deliveryCharges = discountedTotalAmount >= 500 ? 0 : 40;

  let totalAmount = discountedTotalAmount + deliveryCharges;

  return (
    <Layout>
      {cartItems.length > 0 ? (
        <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full">
          <div className="flex-1 p-4 m-2 border rounded-lg overflow-y-auto ">
            {/* Left Section */}
            <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
            <div className="flex flex-col">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-start mb-4 p-2 relative">
                  <div
                    className="absolute top-0 left-0 cursor-pointer"
                    onClick={() =>
                      handleRemoveFromCart(item.productId, item.colorIndex)
                    }
                  >
                    <RemoveCircleIcon />
                  </div>
                  <Link to={`/product/${item.productId}/${item.colorIndex}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 mr-4"
                    />
                  </Link>
                  <div className="flex justify-between items-start w-full gap-4 sm:gap-2">
                    <div className="flex flex-col">
                      <Link
                        to={`/product/${item.productId}/${item.colorIndex}`}
                        className="font-semibold text-xs sm:text-lg"
                      >
                        {item.name} ({item.colorName})
                      </Link>
                      <p className="text-gray-600 text-xs">by {item.brand}</p>
                      {item.stock - item.sold <= 5 && (
                        <p className="text-red-500 text-xs">
                          Only {item.stock - item.sold} left
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs sm:text-lg">
                        {item.price - (item.price * item.discount) / 100}
                      </p>
                      {item.discount !== 0 && (
                        <p className="text-gray-500 line-through text-xs">
                          {item.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg border rounded-lg p-4 m-2 max-h-80">
            {/* Right Section */}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mb-4">Billing Info</h2>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p>Price ({cartItems.length} items)</p>
                  <p>{totalPrice}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p>Discount</p>
                  <p className="text-green-600">- {totalDiscount}</p>
                </div>
                {cart.length >= 5 && (
                  <div className="flex justify-between items-center mb-2">
                    <p>Buy more & save more</p>
                    <p className="text-green-600">
                      - {(totalDiscount * 5) / 100}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center mb-2">
                  <p>Delivery Charges</p>
                  <p>{deliveryCharges}</p>
                </div>
                <hr className="border-t my-2" />
                <div className="flex justify-between items-center">
                  <p>Total</p>
                  <p>{totalAmount}</p>
                </div>
              </div>
              <Link
                to="/order"
                className="bg-black text-white hover:bg-white hover:border hover:text-black border-black ease-in-out transition-all py-2 px-4 rounded self-end"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="sm:pl-20 pl-10 pr-10 pt-10 sm:pr-20 flex flex-col sm:flex-row md:flex-row w-full justify-center">
          <div className="w-full h-fit flex justify-center items-center flex-col gap-5 border bg-gray-50 pt-6 pb-10 rounded-md">
            <img
              src={CartImage}
              alt="empty_cart"
              className="w-full h-full md:w-full md:h-full lg:w-1/3 lg:h-1/3 sm:w-1/3 sm:h-1/3 p-5"
            />
            <p className="text-2xl sm:text-3xl mt-10">Your cart is empty!</p>
            <Link
              to="/explore/all"
              className="px-6 py-2 bg-black text-white rounded-md"
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
