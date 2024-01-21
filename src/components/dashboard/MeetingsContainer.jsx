import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context-values";
import axios from "axios";
import Modal from "../UI/Modal";
import { useNavigate } from "react-router-dom";
import WaitModal from "../UI/WaitModal";
const query_generator = (query) => {
  return {
    query,
  };
};
function MeetingsContainer() {
  const token = useContext(Context).token;
  const socket_context = useContext(Context).socket;
  const socketObject_context = useContext(Context).socketObject;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const setPeerSignalData_context = useContext(Context).setPeerSignalData;

  const navigate = useNavigate();
  const [meeting, setMeeting] = useState("fetching");
  const [noMeeting, setNoMeeting] = useState(null);

  const [showWaitModal, setShowWaitModal] = useState(false);

  const send_join_request = async () => {
    setNotification_context({
      color: "blue",
      data: "📤 Sending request...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
      {
        getCollectorSocket
      }`),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "💀 Something went wrong !",
      });
    } else {
      if (data.data.getCollectorSocket === "false") {
        setNotification_context({
          color: "green",
          data: "😪 Collector offline...",
        });
        setAlertModal_context({
          msg: "Collector is not online yet,\nPlease try again after some time 🙇🏻‍♂️",
          visible: true,
        });
      } else {
        setNotification_context({
          color: "green",
          data: "📨 sent !",
        });
        setShowWaitModal(true);
        socketObject_context.emit("citizen-ready-to-join", {
          citizen: socket_context,
          citizen_email: meeting.from,
          collector: data.data.getCollectorSocket,
        });
      }
    }
  };

  const fetchData = async () => {
    setNotification_context({
      color: "blue",
      data: "🧘🏻 Getting data...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
      {
        myMeeting{
          meeting{
            _id
            from
            date_of_submit
            date
            slot
            overview
            confirm
            cancel
            reason_to_cancel 
          }
        }
      }
        `),
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
    } else {
      if (data.data.myMeeting.meeting) {
        if (
          new Date(
            data.data.myMeeting.meeting.date +
              " " +
              data.data.myMeeting.meeting.slot.split("-")[1]
          ) < new Date()
        ) {
          const res = await axios({
            method: "post", //you can set what request you want to be
            url: process.env.REACT_APP_API,
            data: query_generator(`
            mutation{
              missedMyMeeting(meetingId:"${data.data.myMeeting.meeting._id}")
            }
              `),
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          fetchData();
          setAlreadyExist(false);
          fetchFreeSlots();
        } else {
          setMeeting(data.data.myMeeting.meeting);
        }
      } else {
        setNoMeeting("no meeting");
      }
      setNotification_context({
        color: "green",
        data: "🎉 Updated Just Now !",
      });
    }
  };
  useEffect(() => {
    fetchData();
    fetchFreeSlots();
    socketObject_context.on("callUser", (data) => {
      console.log(data);
      setPeerSignalData_context(data.signal, data.from);
      setPeerSignalData_context({ signal: data.signal, from: data.from });
      navigate("/virtual-meeting");
    });
  }, []);

  const [freeSlots, setFreeSlots] = useState(null);
  const [alreadyExist, setAlreadyExist] = useState(null);
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
      data: "🧘🏻 Getting data...",
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
      if (data.errors[0].message === "One meeting already requested !") {
        setAlreadyExist("cannot procced.");
      } else {
        setNotification_context({
          color: "red",
          data: "⚠ Something went wrong !",
        });
      }
    } else {
      setFreeSlots(data.data.getFreeSlots);
      setNotification_context({
        color: "green",
        data: "🎉 Updated Just Now !",
      });
    }
  };

  return (
    <div className="relative top-[-5.0rem] border-2 border-black rounded-[2.5rem] p-3  flex flex-col gap-2 w-[58rem]  h-[34rem] z-10 bg-white scrollbar-track-slate-300">
      <div className="flex flex-col px-2  overflow-y-auto scrollbar scrollbar-thumb-slate-600 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg gap-3">
        {/* Meeting */}
        <div
          className={`border-2 border-black flex rounded-[2.5rem] p-2 justify-center ${
            meeting
              ? meeting.confirm
                ? "bg-emerald-300"
                : meeting.cancel
                ? "bg-red-300"
                : "bg-blue-300"
              : ""
          }`}
        >
          {meeting === "fetching" && !noMeeting && (
            <h1 className="text-base font-semibold text-center">Loading...</h1>
          )}
          {noMeeting && (
            <h1 className="text-base font-semibold text-center">
              😴 No meeting requested, Please select from below available slots
              to request one !
            </h1>
          )}
          {typeof meeting === "object" ? (
            <div className=" w-full flex flex-col gap-4 h-full rounded-[2.5rem]">
              {/* Dates, status, reason to cancel  and date/timings */}
              <div className="flex pt-1 mb-2  justify-between">
                <span className="text-sm pl-5 font-semibold text-left w-[13rem] whitespace-pre-line">
                  Requested on {"\n"}
                  {meeting.date_of_submit}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-center">
                    {meeting.confirm
                      ? "✔ Confirmed"
                      : meeting.cancel
                      ? "❌ Canceled"
                      : "⌛ Pending"}
                  </span>
                  {meeting.confirm &&
                    new Date(meeting.date + " " + meeting.slot.split("-")[0]) <=
                      new Date() &&
                    new Date(meeting.date + " " + meeting.slot.split("-")[1]) >=
                      new Date() && (
                      <button
                        onClick={send_join_request}
                        className="border-2 border-white h-fit py-1 px-2 bg-white/30 rounded-2xl font-medium hover:bg-white/70 hover:scale-105 transition-all"
                      >
                        🕊 send join request
                      </button>
                    )}
                </div>
                {/* 22:00 - 23:59 */}

                <span className="text-sm font-semibold text-left w-[17rem]">
                  {meeting.cancel
                    ? "📝   " + meeting.reason_to_cancel
                    : "📅   " +
                      new Date(meeting.date).toDateString() +
                      "    ⏲   " +
                      meeting.slot}
                </span>
              </div>
              {/*Meeting overview*/}
              <div className="flex justify-evenly m-2 h-40 overflow-y-auto rounded-[2.5rem] scrollbar scrollbar-thumb-white scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent ">
                <span className="text-lg font-semibold text-left whitespace-pre-line p-2 ">
                  {meeting.overview}
                </span>
              </div>
            </div>
          ) : typeof meeting === null ? (
            <h1 className="text-base font-semibold text-center">
              No upcoming meetings !
            </h1>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Free slots */}
      <div className="border-2 border-black flex flex-wrap gap-5 rounded-[2.5rem] p-2 justify-center bg-purple-300">
        {!freeSlots && !alreadyExist && (
          <span className="text-center font-semibold">Loading...</span>
        )}
        {freeSlots && freeSlots.length < 1 && (
          <span className="text-center font-semibold">
            ❌ No free slots found ❗
          </span>
        )}
        {freeSlots && freeSlots.length >= 1 && (
          <div className="flex flex-wrap gap-5 rounded-[2.5rem] p-2 justify-center bg-purple-300">
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
        {alreadyExist && (
          <span className="text-base font-bold text-center">
            ⛔ only one request can be made at a time, Cannot get free slots !
            😶
          </span>
        )}
        <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
      </div>
      {showWaitModal && <WaitModal />}
    </div>
  );
}

export default MeetingsContainer;
