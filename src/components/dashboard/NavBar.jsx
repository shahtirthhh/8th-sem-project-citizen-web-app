import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../UI/Modal";

function NavBar() {
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (answer) {
      setShowModal(false);
      setAnswer(null);
      logout();
    } else {
      setShowModal(false);
      setAnswer(null);
    }
  }, [answer]);
  const logout = () => {
    window.location.reload();
  };
  return (
    <>
      <ul className="bg-zinc-400 flex flex-row justify-center py-1 ">
        <li className="text-xs font-medium ml-7">
          <Link to="/dashboard" className="">
            Home
          </Link>
        </li>
        <li className="text-xs font-medium ml-7">
          <Link to="meetings" className="">
            Meetings
          </Link>
        </li>
        <li className="text-xs font-medium ml-7">
          <Link to="complaints" className="">
            Complaints
          </Link>
        </li>
        <li className="text-xs font-medium ml-7">
          <Link to="notice-board" className="">
            Notice Board
          </Link>
        </li>
        <li className="text-xs font-medium ml-7">
          <Link to="reports-activities" className="">
            Reports
          </Link>
        </li>
        <li className="text-xs font-medium ml-7">
          <Link to="success-stories" className="">
            Success stories
          </Link>
        </li>
        <li className="text-xs font-medium ml-7">
          <button
            onClick={() => {
              setMsg("Sure to logout ?");
              setShowModal(true);
            }}
            className=""
          >
            Logout
          </button>
        </li>
      </ul>
      <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
    </>
  );
}

export default NavBar;
