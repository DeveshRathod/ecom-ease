import React, { useState } from "react";
import Authwrapper from "../components/Authwrapper";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });
      if (!response.ok) {
        setError("Something went wrong");
        return;
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      const user = JSON.stringify(data.currentUser);
      localStorage.setItem("currentUser", user);
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      setError("Cannot sign up");
      setUsername("");
      setEmail("");
      setPassword("");
      console.log(error.message);
      return;
    }
  };

  return (
    <Authwrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-[#FFBE98]">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4"
        >
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Username"
            />
          </div>

          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Password"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="confirmation"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full md:w-96 px-4 py-3 rounded-md outline-none shadow-inner"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-[#FFBE98] hover:opacity-95"
          >
            Sign Up
          </button>
          <p>
            Already have an account?{" "}
            <Link className="hover:underline" to="/signin">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Authwrapper>
  );
};

export default Signup;
