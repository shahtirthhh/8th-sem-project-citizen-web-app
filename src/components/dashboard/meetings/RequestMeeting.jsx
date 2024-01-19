import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../store/context-values";
import axios from "axios";
import Modal from "../../UI/Modal";
import { useNavigate } from "react-router-dom";
function RequestMeeting() {
  const token = useContext(Context).token;
  const navigate = useNavigate();
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const [slot, setSlot] = useState(null);
  const [overview, setOverview] = useState(`
    Subject: //Replace this text to your concern for scheduling a meeting.\n\n
    Respected Collector,\n
    //Write down an overview of your concern.\n

    Thank you for your time and dedication.\n

    Best regards,\n
    [Your Name]\n
    [Your Occupation]\n
    [Your Contact Information]\n
  `);
  useEffect(() => {
    const date = localStorage.getItem("date");
    const name = localStorage.getItem("slot-name");
    const time = localStorage.getItem("slot-time");
    if (!date || !name || !time) {
      setAlertModal_context({
        msg: `👎🏻 Bad request`,
        visible: true,
      });
      navigate("/dashboard/meetings");
    } else {
      setSlot({ date, time, name });
    }
  }, []);

  return (
    <div className="relative top-[-5.0rem] border-2 border-black rounded-[2.5rem] p-3  flex flex-col gap-2 w-[58rem]  h-[34rem] z-10 bg-white">
      <div className="border-2 border-black flex flex-col rounded-[2.5rem] p-3 bg-sky-400 justify-center">
        <span className="mx-[0.8rem] font-medium">
          👉🏻 Please write down overview message ✉, to know your concern better
          to procced furthur steps.👣
        </span>
        <textarea
          className="bg-sky-200 font-medium p-1 m-2 rounded-xl border-2 border-sky-700 scrollbar scrollbar-thumb-sky-600 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg"
          rows={13}
          cols={80}
          defaultValue={overview}
          onChange={(event) => setOverview(event.target.value)}
        />
        <div className="flex gap-4 rounded-[2.5rem] p-3">
          <span className="font-medium">📆 {slot && slot.date}</span>
          <span className="font-medium">⏲ {slot && slot.time}</span>
        </div>
        <div className="rounded-[2.5rem] p-3 flex gap-5">
          {overview.trim().length <= 50 && (
            <span className="font-medium">
              ❌ An overview must contain certain amount of text.
            </span>
          )}
          {overview.trim().length >= 50 && (
            <button className="flex p-1 h-9 font-medium bg-green-300 border-2 border-green-600 rounded-xl">
              Send Request
            </button>
          )}
          {overview.trim().length >= 50 && (
            <span className="font-medium whitespace-pre-line">{`❗ All timings are in 24 hours format\n❗ Once request is accepted, A meeting on this portal will be oraginzed on selected time and date.`}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestMeeting;
