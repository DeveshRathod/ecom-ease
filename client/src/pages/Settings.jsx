import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SettingsWrapper from "../components/SettingsWrapper";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";
import Error from "../components/Error";

const Settings = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [address, setAddress] = useState({});

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    profile: currentUser.profile,
    password: "",
    confirmPassword: "",
  });

  const [addressData, setAddressData] = useState({
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    pincode: "",
  });

  const resetAddress = () => {
    setAddressData({
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      pincode: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuccess("");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSuccess("");
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.put(
          "http://localhost:4000/api/user/update",
          formData,
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );

        dispatch(setUser(response.data));
        const user = JSON.stringify(response.data);
        localStorage.setItem("currentUser", user);
        setSuccess("User updated successfully");
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
      setErrorMessage("Invalid token signin again");
      navigate("/signin");
      localStorage.setItem("currentUser", null);
    }
  };

  const addressSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/user/addAddress",
          addressData,
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );

        setSuccess("Successfully added address");
        resetAddress();
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowModal(true);
        resetAddress();
      }
    } else {
      setShowModal(true);
      setErrorMessage("Invalid token signin again");
      navigate("/signin");
      localStorage.setItem("currentUser", null);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:4000/api/user/getAddress",
            {
              headers: {
                authorization: `${token}`,
              },
            }
          );

          const addresses = await response.data;
          setAddress(addresses);
        } else {
          navigate("/signin");
          setErrorMessage("Invalid token signin again");
        }
      } catch (error) {
        setShowModal(true);
        setErrorMessage(error.message);
      }
    };

    fetchAddress();
  }, [addressSubmit]);

  return (
    <SettingsWrapper>
      <div className="main flex flex-col items-center pt-6">
        <h1 className="text-5xl">Settings</h1>

        <div className="flex justify-center">
          <img
            src={currentUser.profile}
            alt="profile"
            className="w-56 h-56 pt-2 self-center object-cover rounded-full shadow-md mt-2 mb-2"
          />
        </div>
        <div className="min-h-10 w-full sm:min-w-full">
          {showModal && (
            <Error message={errorMessage} setShowModal={setShowModal} />
          )}
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
            />
          </div>
          <button
            className="self-end p-3 rounded bg-[#FFBE98]"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>

        {!currentUser.isAdmin && (
          <>
            <h1 className=" text-5xl mt-10">Address</h1>
            <div>
              <div className="flex flex-wrap gap-6 mt-10">
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label htmlFor="addressLine1">Floor/Flat No.</label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={addressData.addressLine1}
                    onChange={handleAddressChange}
                    className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label htmlFor="addressLine2">Area</label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={addressData.addressLine2}
                    onChange={handleAddressChange}
                    className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label htmlFor="addressLine3">City</label>
                  <input
                    type="text"
                    id="addressLine3"
                    name="addressLine3"
                    value={addressData.addressLine3}
                    onChange={handleAddressChange}
                    className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={addressData.pincode}
                    onChange={handleAddressChange}
                    className="p-2 bg-[#FEECE2] rounded-md shadow-inner outline-none"
                  />
                </div>
                <button
                  className=" self-end p-3 rounded bg-[#FFBE98]"
                  onClick={addressSubmit}
                >
                  New Address
                </button>
              </div>
            </div>
          </>
        )}
        <div className=" mt-6">
          <h1 className=" text-[#FFBE98]">{success}</h1>
        </div>
      </div>
    </SettingsWrapper>
  );
};

export default Settings;
