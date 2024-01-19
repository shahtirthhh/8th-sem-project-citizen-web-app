import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Context } from "../store/context-values";
import Header from "../components/homepage/Header";
import NavBar from "../components/dashboard/NavBar";
import NoticeContainer from "../components/dashboard/NoticeContainer";
import SuccessContainer from "../components/dashboard/SuccessContainer";

function Dashboard() {
  const navigate = useNavigate();
  const token = useContext(Context).token;
  //   if (!token) {
  //     navigate("/");
  //   }
  return (
    <div>
      <Header />
      {/* <NavBar /> */}
      <div className="border border-blue-500 flex">
        <NoticeContainer />
        <Outlet />
        <SuccessContainer />
      </div>
    </div>
  );
}

export default Dashboard;
