import React, { useState } from "react";
import axios from "axios";
import { Context } from "../../store/context-values";
import { useNavigate } from "react-router-dom";

import Register from "./Register";
import Login from "./Login";

function RightContainer() {
  const [active, setActive] = useState("register");
  return (
    <div className="w-[40%] h-full justify-center bg-gradient-to-r from-white to-cyan-400 p-1 flex flex-col">
      {/* Navigation panel */}
      <div className="flex flex-row w-auto justify-center gap-2">
        <button
          onClick={() => setActive("register")}
          className={`uppercase text-md font-medium  p-1 ${
            active === "register" ? "border-b-2 border-purple-700" : ""
          }`}
        >
          Register
        </button>
        <button
          onClick={() => setActive("login")}
          className={`uppercase text-md font-medium p-1 ${
            active === "login" ? "border-b-2 border-purple-700" : ""
          }`}
        >
          Login
        </button>
      </div>
      {active === "register" ? <Register /> : <Login />}
    </div>
  );
}

export default RightContainer;
