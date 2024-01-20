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

  const send_request_for_meeting = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Sending Meeting Request...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
      mutation{
          requestMeeting(date:"""${slot.date}""",slot:"""${slot.name}""",overview:"""${overview}""")
          
      }`),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      console.log(data.errors);
      setNotification_context({
        color: "red",
        data: "⚠ Something went wrong !",
      });
    } else if (data.data.requestMeeting) {
      setNotification_context({
        color: "green",
        data: "📤 Request sent !",
      });
      setTimeout(() => {
        navigate("/dashboard/meetings");
      }, 700);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (answer) {
      setShowModal(false);
      setAnswer(null);
      send_request_for_meeting();
    } else {
      setShowModal(false);
      setAnswer(null);
    }
  }, [answer]);
  return (
    <div className="relative top-[-5.0rem] border-2 border-black rounded-[2.5rem] p-3  flex flex-col gap-2 w-[58rem]  h-[34rem] z-10 bg-white">
      <div className="border-2 border-black flex flex-col rounded-[2.5rem] p-3 bg-sky-400 justify-center">
        <span className="mx-[0.8rem] font-medium">
          👉🏻 Please write down an overview message ✉, to know your concern
          better to procced furthur steps.👣
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
            <button
              onClick={() => {
                setMsg(
                  `Confirm to request meeting on \n 📆 ${slot.date}\n ⌚ ${slot.time} \n (This action cannot be reversed ◀)`
                );
                setShowModal(true);
              }}
              className="flex p-1 h-9 font-medium bg-green-300 border-2 border-green-600 rounded-xl"
            >
              Send Request
            </button>
          )}
          {overview.trim().length >= 50 && (
            <span className="font-medium whitespace-pre-line">{`❗ All timings are in 24 hours format\n❗ Once request is accepted, A meeting on this portal will be oraginzed on above time and date.`}</span>
          )}
        </div>
      </div>
      <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
    </div>
  );
}

export default RequestMeeting;
