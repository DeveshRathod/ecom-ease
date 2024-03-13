import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SettingsWrapper from "../components/SettingsWrapper";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";
import CreateIcon from "@mui/icons-material/Create";
import Error from "../components/Error";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase";
import Address from "../components/Address";

const Settings = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [address, setAddress] = useState(false);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    profile: currentUser.profile,
    birthday: currentUser.birthday,
    gender: currentUser.gender,
    mobile: currentUser.mobile,
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSuccess("");
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  const formattedBirthday = formData.birthday
    ? formData.birthday.split("T")[0]
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "birthday") {
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          formattedValue = `${year}-${month}-${day}`;
        }
      }
    }

    setSuccess("");
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
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
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setSuccess("");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setErrorMessage("Image upload failed");
        setShowModal(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profile: downloadURL })
        );
      }
    );
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
        setFilePerc(null);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <SettingsWrapper>
      <div className="main">
        <h1 className="pt-3 pb-3 text-3xl font-semibold">Profile Settings</h1>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-2">
            <div className="flex justify-center sm:justify-end relative">
              <label className="cursor-pointer">
                <div className="relative group">
                  <div className=" flex">
                    <img
                      src={formData.profile || currentUser.profile}
                      alt="profile"
                      className="w-52 h-52 sm:w-40 sm:h-40 md:w-52 md:h-52 object-cover shadow-md cursor-default transition-opacity duration-300 ease-in-out hover:opacity-95"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 flex items-start justify-end opacity-0 group-hover:opacity-100">
                    <CreateIcon
                      className="text-white bg-[#FFBE98] rounded-full p-2 shadow-xl"
                      style={{ fontSize: "40px" }}
                      onClick={() => fileRef.current.click()}
                    />
                  </div>
                </div>
              </label>
              <input
                onChange={handleFileChange}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
            </div>
            <div>
              {showModal && (
                <Error message={errorMessage} setShowModal={setShowModal} />
              )}
            </div>
            <div className="flex justify-center min-h-10">{success}</div>
          </div>

          <div className="flex-1 flex flex-col gap-6 p-2 shadow-md">
            <div className="flex flex-col">
              <label className="mb-2 text-lg">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-4 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-lg">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-4 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-lg">Contact</label>
              <input
                type="mobile"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-4 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-lg">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formattedBirthday}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-4 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-lg">Gender</label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-4 rounded-md focus:outline-none w-full"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <button
                className="self-end py-3 px-6 text-white rounded bg-[#FFBE98] font-semibold outline-none"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="flex-1 shadow-md">
            <div className="p-2">
              <div className="flex p-3 bg-[#FEECE2] justify-between">
                <div className="flex-3">
                  <h1>Password</h1>
                  <p className="text-xs w-fit sm:w-[200px]">
                    Reset or Change Password
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setShowAddressForm(false);
                  }}
                  className="p-2 rounded-md text-sm bg-[#F7DED0] py-2 px-4"
                >
                  Password
                </button>
              </div>
              {showPasswordForm && (
                <form
                  className="p-3 bg-[#FEECE2] flex gap-2 flex-col"
                  onSubmit={handleSubmit}
                >
                  <div className=" flex justify-evenly gap-3">
                    <div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-[#F7DED0] py-2 px-4 rounded-md focus:outline-none w-full"
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="bg-[#F7DED0] py-2 px-4 rounded-md focus:outline-none w-full"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <button className=" py-2 px-4 rounded-md bg-[#FFBE98] ">
                    Submit
                  </button>
                </form>
              )}
            </div>

            {currentUser && !currentUser.isAdmin && (
              <div className="p-2">
                <div className="flex p-3 bg-[#FEECE2] justify-between">
                  <div className="flex-3">
                    <h1>Address</h1>
                    <p className="text-xs w-fit sm:w-[200px]">
                      Add new address
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddressForm(!showAddressForm);
                      setShowPasswordForm(false);
                    }}
                    className="p-2 rounded-md text-sm bg-[#F7DED0] py-2 px-4"
                  >
                    Add new
                  </button>
                </div>
                {showAddressForm && (
                  <form className="p-3 bg-[#FEECE2] flex flex-col gap-2">
                    <div>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={addressData.addressLine1}
                        onChange={handleAddressChange}
                        className="bg-[#F7DED0] py-2 px-4 rounded-md focus:outline-none w-full"
                        placeholder="Flat No,Building Name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={addressData.addressLine2}
                        onChange={handleAddressChange}
                        className="bg-[#F7DED0] py-2 px-4 rounded-md focus:outline-none w-full"
                        placeholder="Area"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="addressLine3"
                        name="addressLine3"
                        value={addressData.addressLine3}
                        onChange={handleAddressChange}
                        className="bg-[#F7DED0] py-2 px-4 rounded-md focus:outline-none w-full"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={addressData.pincode}
                        onChange={handleAddressChange}
                        className="bg-[#F7DED0] py-2 px-4 rounded-md focus:outline-none w-full"
                        placeholder="Pincode"
                      />
                    </div>
                    <button
                      className=" self-end p-3 rounded bg-[#FFBE98]"
                      onClick={addressSubmit}
                    >
                      New Address
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="p-2">
              <div className="flex p-3 bg-[#FEECE2] justify-between">
                <div className="flex-3">
                  <h1>Deactivate</h1>
                  <p className="text-xs w-fit sm:w-[200px]">
                    Once deleted order and cart details will be lost
                  </p>
                </div>
                <button className="p-2 rounded-md text-sm bg-[#F7DED0] py-2 px-6 text-red-500">
                  Delete
                </button>
              </div>
            </div>

            {!showAddressForm &&
              !showPasswordForm &&
              address &&
              !currentUser.isAdmin && (
                <div className="p-2 flex flex-col h-fit">
                  <h1>Addresses</h1>
                  <div className="flex p-3 bg-[#FEECE2] flex-col h-[350px] overflow-y-scroll gap-3">
                    {address.map((add, index) => (
                      <Address key={index} address={add} />
                    ))}

                    {address.length === 0 && (
                      <p className=" text-gray-500">No Address Added</p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </SettingsWrapper>
  );
};

export default Settings;
