import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Modal from "../UI/Modal";

function NavBar() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  const [active, setActive] = useState(location.pathname);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

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
      <ul
        className={`hover:top-[0rem] top-[2.8rem] items-center transition-all  border-2 border-black rounded-t-[2.5rem] bg-teal-100 flex flex-col h-40 relative z-0 `}
      >
        <div className="flex gap-3">
          <li
            className={` transition-all hover:bg-teal-300 rounded-b-lg flex flex-col text-lg font-medium p-2 px-4 h-fit  ${
              active === "/dashboard" ? "bg-teal-500 rounded-b-lg" : ""
            } `}
          >
            <Link to="" className="">
              Meetings
            </Link>
          </li>
          <li
            className={`text-lg transition-all hover:bg-teal-300 rounded-b-lg font-medium p-2 px-4 h-fit ${
              active === "/dashboard/complaints"
                ? "bg-teal-400 rounded-b-lg"
                : ""
            } `}
          >
            <Link to="complaints" className="">
              Complaints
            </Link>
          </li>

          <li
            className={`text-lg transition-all hover:bg-teal-300 rounded-b-lg font-medium p-2 px-4 h-fit ${
              active === "/dashboard/reports-activities"
                ? "bg-teal-400 rounded-b-lg"
                : ""
            } `}
          >
            <Link to="reports-activities" className="">
              Reports
            </Link>
          </li>

          <li
            className={`text-lg transition-all hover:bg-teal-300 rounded-b-lg font-medium p-2 px-4 h-fit`}
          >
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
        </div>
        <div className="flex gap-3">
          <li
            className={` transition-all hover:bg-teal-300 flex flex-col text-lg font-medium mt-1 rounded-t-lg pb-2 px-4 h-fit  ${
              active === "/dashboard/previous-meetings"
                ? "bg-teal-400 rounded-t-lg"
                : ""
            } `}
          >
            <Link to="previous-meetings" className="">
              Previous Meetings
            </Link>
          </li>
          <li
            className={`text-lg transition-all hover:bg-teal-300 font-medium mt-1 rounded-t-lg pb-2 px-4 h-fit ${
              active === "/dashboard/complaints-history"
                ? "bg-teal-400 rounded-t-lg"
                : ""
            } `}
          >
            <Link to="complaints-history" className="">
              Complaint-History
            </Link>
          </li>

          <li
            className={`text-lg transition-all hover:bg-teal-300 font-medium mt-1 rounded-t-lg pb-2  px-4 h-fit ${
              active === "/dashboard/reports-history"
                ? "bg-teal-400 rounded-t-lg"
                : ""
            }`}
          >
            <Link to="reports-history" className="">
              Reports-History
            </Link>
          </li>
        </div>
      </ul>

      <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
    </>
  );
}

export default NavBar;
