import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/reducers/user.slice.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebase.js";
import Layout from "../components/Layout";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Message from "../components/Message.jsx";

const Settings = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [backgroundData, setBackgroundData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const fileInputRefIcon = useRef(null);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    profile: currentUser.profile,
    background: currentUser.background,
    gender: currentUser.gender,
    birthday: currentUser.birthday,
    mobile: currentUser.mobile,
    createdAt: currentUser.createdAt,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    password: "",
    confirmPassword: "",
  });
  const [addressData, setAddressData] = useState({
    type: "",
    name: "",
    mobile: currentUser.mobile,
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    pincode: "",
  });

  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    const fetchAddresses = async () => {
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
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchAddresses();
  }, []);

  function getDate(dateString) {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
  }

  const handleFileUploadToFirebase = (type, image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const storageRef = ref(
        storage,
        `/${type}/${new Date().getTime()}_${image.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error.message);
            });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let profileUrl = "";
      let backgroundUrl = "";
      if (selectedFile) {
        profileUrl = await handleFileUploadToFirebase("profile", selectedFile);
      }

      if (backgroundData) {
        backgroundUrl = await handleFileUploadToFirebase(
          "background",
          backgroundData
        );
      }

      const token = localStorage.getItem("token");
      if (token) {
        const newBackground = backgroundData
          ? backgroundUrl
          : formData.background;
        const newProfile = selectedFile ? profileUrl : formData.profile;
        const response = await axios.put(
          "http://localhost:4000/api/user/update",
          { ...formData, profile: newProfile, background: newBackground },
          {
            headers: {
              authorization: `${token}`,
            },
          }
        );
        const user = JSON.stringify(response.data);
        localStorage.setItem("currentUser", user);
        dispatch(setUser(response.data));
        setSuccess("User updated successfully");
      } else {
        setErrorMessage(error.response.data.message);
        setShowModal(true);
      }
    } catch (error) {
      setShowModal(true);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleBackgroundChange = (e) => {
    setBackgroundData(e.target.files[0]);
  };

  const handleClick = () => {
    if (fileInputRef.current && fileInputRef.current.click) {
      fileInputRef.current.click();
    }
  };

  const handleIconClick = () => {
    if (fileInputRefIcon.current && fileInputRefIcon.current.click) {
      fileInputRefIcon.current.click();
    }
  };

  return (
    <Layout>
      <div className="min-w-screen min-h-fit mt-10 bg-white">
        <div className="relative mx-auto max-w-screen-lg pl-8 pr-8 sm:pl-0 sm:pr-0 md:pl-8 lg:pl-0 lg:pr-0 md:pr-8">
          <div className="bg-white shadow border rounded-lg">
            <div className="w-full h-fit relative">
              <img
                src={
                  backgroundData
                    ? URL.createObjectURL(backgroundData)
                    : currentUser.background
                }
                alt="background"
                className="h-[210px] w-full object-cover rounded-t-lg"
              />
              <div onClick={handleIconClick}>
                <EditIcon className="absolute top-2 right-2 mt-2 mr-2 w-8 h-8 text-gray-300 cursor-pointer " />
              </div>

              <input
                type="file"
                ref={fileInputRefIcon}
                onChange={handleBackgroundChange}
                accept="image/*"
                className="hidden"
              />
            </div>

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

            {showModal2 && (
              <Dialog
                setShowModal={setShowModal2}
                headline={"Do You really want to delete"}
                dialogFun={dialogFun}
                showModel={showModal2}
              />
            )}

            <div className="flex flex-col items-center -mt-40 p-20 relative justify-center">
              <div onClick={handleClick} className="cursor-pointer w-40 h-40">
                <img
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : currentUser.profile
                  }
                  className=" w-full h-full rounded-full object-cover cursor-pointer shadow-lg"
                  alt="profile"
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
                className="hidden"
              />
              <p className="text-gray-700 text-2xl mt-4">
                {currentUser.username}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {getDate(currentUser.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-screen min-h-fit mt-10 bg-white">
        <div className="relative mx-auto max-w-screen-lg pl-8 pr-8 sm:pl-0 sm:pr-0 md:pl-8 lg:pl-0 lg:pr-0 md:pr-8">
          <div className="p-6 bg-white shadow border rounded-lg">
            <h1 className=" text-xl sm:text-3xl font-bold mb-4">
              Personal Information
            </h1>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className=" w-full p-2 outline-none rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className=" w-full p-2 outline-none rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className=" w-full p-2 outline-none rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className=" w-full p-2 outline-none rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={
                    formData.birthday ? formData.birthday.slice(0, 10) : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                  className=" w-full p-2 outline-none rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className=" w-full p-2 outline-none rounded-md shadow-sm"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="col-span-full md:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  className=" p-3 rounded-md bg-green-500 text-white"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {!currentUser.isAdmin && (
        <div className="min-w-screen min-h-fit mt-10 bg-white">
          <div className="relative mx-auto max-w-screen-lg pl-8 pr-8 sm:pl-0 sm:pr-0 md:pl-8 lg:pl-0 lg:pr-0 md:pr-8">
            <div className="p-6 bg-white shadow  border rounded-lg">
              <h1 className="text-xl sm:text-3xl font-bold mb-4">Addresses</h1>
              <button className="flex p-2 gap-2 border w-full rounded-md">
                <AddIcon />
                <p className=" uppercase">New address</p>
              </button>

              <div className="flex flex-wrap mt-4">
                {addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <div key={index} className="w-full">
                      <div className="border p-4 rounded-md flex flex-col justify-between">
                        <div>
                          <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-sm mb-2">
                            {address.type}
                          </button>
                          <div className="flex justify-start">
                            <div className=" flex justify-center items-center gap-5">
                              <h1 className="text-lg font-semibold">
                                {address.name}
                              </h1>
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
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center">No addresses found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Settings;
