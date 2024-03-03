import React from "react";
import Authwrapper from "../components/Authwrapper";
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <Authwrapper>
      <div className="flex items-center flex-col gap-6">
        <h1 className="font-semibold text-3xl text-[#FFBE98]">Sign In</h1>
        <div className="flex items-center justify-center flex-col gap-4">
          <div className="relative">
            <input
              type="email"
              id="email"
              className="px-36 py-3 rounded-md pl-6 outline-none shadow-inner"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              className="px-36 py-3 rounded-md pl-6 outline-none shadow-inner"
              placeholder="Password"
            />
          </div>
          <button className=" w-full p-3 rounded-md bg-[#FFBE98] hover:opacity-95">
            Sign In
          </button>
          <p>
            Dont have an account?{" "}
            <Link className=" hover:underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Authwrapper>
  );
};

export default Signin;
