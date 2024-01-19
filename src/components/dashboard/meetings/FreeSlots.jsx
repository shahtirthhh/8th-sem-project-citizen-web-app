import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context-values";
import axios from "axios";

import Modal from "../../UI/Modal";
import { useNavigate } from "react-router-dom";
const query_generator = (query) => {
  return {
    query,
  };
};
function FreeSlots() {
  const token = useContext(Context).token;
  const navigate = useNavigate();
  const setNotification_context = useContext(Context).setNotification;

  const [freeSlots, setFreeSlots] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (answer) {
      setShowModal(false);
      setAnswer(null);
      localStorage.setItem("date", selected.date);
      localStorage.setItem("slot-name", selected.slot.name);
      localStorage.setItem("slot-time", selected.slot.time);
      navigate("/dashboard/request-meeting");
    } else {
      setShowModal(false);
      setAnswer(null);
      setSelected(null);
    }
  }, [answer]);

  const fetchFreeSlots = async () => {
    setNotification_context({
      color: "blue",
      data: "Getting data...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
      {
        getFreeSlots{
            date
            slot {
                name
                time
            }
        }
          
      }`),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      console.log(data.errors);
      setNotification_context({
        color: "red",
        data: "Something went wrong !",
      });
    } else {
      //   var free = [];
      //   data.data.getFreeSlots.map((slot, index) => {
      //     if (
      //       index !== 0 &&
      //       data.data.getFreeSlots[index - 1].date === slot.date
      //     ) {
      //       free[-1].slots.push(slot);
      //     }
      //     free.push({ date: slot.date, slots: [slot.slot] });
      //   });
      setFreeSlots(data.data.getFreeSlots);
      setNotification_context({
        color: "green",
        data: "Updated Just Now !",
      });
    }
  };
  useEffect(() => {
    fetchFreeSlots();
  }, []);
  return (
    <div className="border-2 border-black flex flex-wrap gap-5 rounded-[2.5rem] p-2 justify-center bg-purple-300">
      {!freeSlots && (
        <span className="text-center font-semibold">Loading...</span>
      )}
      {freeSlots && freeSlots.length < 1 && (
        <span className="text-center font-semibold">
          ❌ No free slots found ❗
        </span>
      )}
      {freeSlots && freeSlots.length >= 1 && (
        <div className="flex flex-wrap gap-5 rounded-[2.5rem] p-2 justify-start bg-purple-300">
          {freeSlots.map((slot) => {
            return (
              <div
                onClick={() => {
                  setSelected(slot);
                  setMsg(
                    `Are you sure you want to procced ⁉ \n 📆 ${slot.date}\n ⌚ ${slot.slot.time}`
                  );
                  setShowModal(true);
                }}
                className="hover:scale-105 cursor-pointer transition-transform bg-white flex flex-col gap-2 rounded-[2.5rem] p-4 justify-evenly"
                key={slot.date}
              >
                <span className="text-base font-bold text-center">
                  {slot.date}
                </span>
                <span className="text-base font-semibold text-center">
                  {slot.slot.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
    </div>
  );
}

export default FreeSlots;
