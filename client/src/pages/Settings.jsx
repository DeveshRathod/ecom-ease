import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";
import CreateIcon from "@mui/icons-material/Create";
import Message from "../components/Message";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase";
import Address from "../components/Address";
import Dialog from "../components/Dialog";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [address, setAddress] = useState(false);
  const navigate = useNavigate();

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
  }, [addressSubmit]);

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

  const dialogFun = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.delete(
          "http://localhost:4000/api/user/delete",
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );

        if (response.status === 200) {
          localStorage.setItem("token", "");
          localStorage.setItem("currentUser", null);
          dispatch(setUser(null));
          navigate("/");
          setSuccess("Account deleted successfully");
        } else {
          setShowModal(true);
          setErrorMessage("Account deletion failed");
        }
      } catch (error) {
        setShowModal(true);
        setErrorMessage(error.message);
      }
    }
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
    <Layout>
      {showModal && (
        <Message
          message={errorMessage}
          setShowModal={setShowModal}
          showModel={showModal}
          isError={true}
        />
      )}
      {success && (
        <Message
          message={success}
          setShowModal={setSuccess}
          showModel={success}
          isError={false}
        />
      )}
      <div className="main">
        <h1 className="pt-4 pb-4 text-2xl font-semibold">Profile Settings</h1>
        {showModal2 && (
          <Dialog
            setShowModal={setShowModal2}
            message={"Do You really want to delete"}
            dialogFun={dialogFun}
          />
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-4 p-2 shadow-md">
            <div className="flex justify-start relative">
              <label className="cursor-pointer">
                <div className="relative group">
                  <div className="flex w-full justify-normal">
                    <img
                      src={formData.profile || currentUser.profile}
                      alt="profile"
                      className="w-28 h-28 sm:w-24 sm:h-24 object-cover shadow-md cursor-default transition-opacity duration-300 ease-in-out hover:opacity-95"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 flex items-start justify-end opacity-0 group-hover:opacity-100">
                    <CreateIcon
                      className="text-white bg-[#FFBE98] rounded-full p-1 shadow-xl"
                      style={{ fontSize: "28px" }}
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
            <div className="flex flex-col">
              <label className="mb-1 text-lg">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-5 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-lg">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-5 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-lg">Contact</label>
              <input
                type="mobile"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-5 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-lg">Birthday</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formattedBirthday}
                onChange={handleChange}
                className="bg-[#FEECE2] py-2 px-5 rounded-md focus:outline-none w-full"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-lg">Gender</label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-[#FEECE2] py-3 px-5 rounded-md focus:outline-none w-full"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
            <div>
              <button
                className="self-end py-2 px-5 text-white rounded bg-[#FFBE98] font-semibold outline-none"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="flex-1 shadow-md">
            <div className="p-2">
              <div className="flex p-2 bg-[#FEECE2] justify-between">
                <div className="flex-3">
                  <h1 className="text-lg">Password</h1>
                  <p className="text-xs">Reset or Change Password</p>
                </div>
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setShowAddressForm(false);
                  }}
                  className="p-1 rounded-md text-sm bg-[#F7DED0] py-1 px-2"
                >
                  Password
                </button>
              </div>
              {showPasswordForm && (
                <form
                  className="p-2 bg-[#FEECE2] flex gap-2 flex-col"
                  onSubmit={handleSubmit}
                >
                  <div className=" flex justify-between">
                    <div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-[#F7DED0] py-2 px-5 rounded-md focus:outline-none w-full"
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
                        className="bg-[#F7DED0] py-2 px-5 rounded-md focus:outline-none w-full"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <button className="py-2 px-5  rounded-md bg-[#FFBE98]">
                    Submit
                  </button>
                </form>
              )}
            </div>

            {currentUser && !currentUser.isAdmin && (
              <div className="p-2">
                <div className="flex p-2 bg-[#FEECE2] justify-between">
                  <div className="flex-3">
                    <h1 className="text-lg">Address</h1>
                    <p className="text-xs">Add new address</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddressForm(!showAddressForm);
                      setShowPasswordForm(false);
                    }}
                    className="p-1 rounded-md text-sm bg-[#F7DED0] py-1 px-2"
                  >
                    Add new
                  </button>
                </div>
                {showAddressForm && (
                  <form className="p-2 bg-[#FEECE2] flex flex-col gap-2">
                    <div>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={addressData.addressLine1}
                        onChange={handleAddressChange}
                        className="bg-[#F7DED0] py-2 px-5 rounded-md focus:outline-none w-full"
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
                        className="bg-[#F7DED0] py-2 px-5 rounded-md focus:outline-none w-full"
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
                        className="bg-[#F7DED0] py-2 px-5 rounded-md focus:outline-none w-full"
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
                        className="bg-[#F7DED0] py-2 px-5 rounded-md focus:outline-none w-full"
                        placeholder="Pincode"
                      />
                    </div>
                    <button
                      className="self-end py-2 px-5 rounded bg-[#FFBE98] "
                      onClick={addressSubmit}
                    >
                      New Address
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="p-2">
              <div className="flex p-2 bg-[#FEECE2] justify-between">
                <div className="flex-3">
                  <h1 className="text-lg">Deactivate</h1>
                  <p className="text-xs">
                    Once deleted order and cart details will be lost
                  </p>
                </div>
                <button
                  className="p-1 rounded-md text-sm bg-[#F7DED0] py-1 px-2 text-red-500"
                  onClick={() => setShowModal2(true)}
                >
                  Delete
                </button>
              </div>
            </div>

            {!showAddressForm &&
              !showPasswordForm &&
              address &&
              !currentUser.isAdmin && (
                <div className="p-2 flex flex-col">
                  <h1 className="text-lg">Addresses</h1>
                  <div className="flex p-2 bg-[#FEECE2] flex-col h-[363px] overflow-y-scroll gap-1">
                    {address.map((add, index) => (
                      <Address key={index} address={add} />
                    ))}
                    {address.length === 0 && (
                      <p className="text-gray-500">No Address Added</p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
