import React, { useState } from "react";
import Authwrapper from "../components/Authwrapper";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/user.slice";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
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
      setEmail("");
      setPassword("");
      dispatch(setUser(data.currentUser));
      navigate("/");
    } catch (error) {
      setError("Cannot sign in");
      setEmail("");
      setPassword("");
      return;
    }
  };

  return (
    <Authwrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-black">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-4"
        >
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
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-[#FFBE98] hover:opacity-95"
          >
            Sign In
          </button>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Authwrapper>
  );
};

export default Signin;
