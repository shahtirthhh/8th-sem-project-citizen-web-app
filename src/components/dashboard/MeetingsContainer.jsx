import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context-values";
import axios from "axios";
import FreeSlots from "./meetings/FreeSlots";

const query_generator = (query) => {
  return {
    query,
  };
};
function MeetingsContainer() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const [meeting, setMeeting] = useState("fetching");
  const [previousMeetings, setPreviousMeetings] = useState(null);
  const fetchData = async () => {
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
        myMeeting{
          meeting{
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
        data: "Something went wrong !",
      });
    } else {
      setMeeting(data.data.myMeeting.meeting);

      setNotification_context({
        color: "green",
        data: "Updated Just Now !",
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative top-[-5.0rem] border-2 border-black rounded-[2.5rem] p-3  flex flex-col gap-2 w-[58rem]  h-[34rem] z-10 bg-white scrollbar-track-slate-300">
      <div className="flex flex-col px-2 rounded-[2.5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 gap-3">
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
          {meeting === "fetching" && (
            <h1 className="text-base font-semibold text-center">Loading...</h1>
          )}
          {typeof meeting === "object" ? (
            <div className=" w-full flex flex-col gap-4 h-full rounded-[2.5rem]">
              {/* Dates, status, reason to cancel  and date/timings */}
              <div className="flex pt-1 mb-2 gap-40">
                <span className="text-sm pl-5 font-semibold text-left w-[13rem] whitespace-pre-line">
                  Requested on {"\n"}
                  {meeting.date_of_submit}
                </span>
                <span className="text-sm font-semibold text-center">
                  {meeting.confirm
                    ? "✔ Confirmed"
                    : meeting.cancel
                    ? "❌ Canceled"
                    : "⌛ Pending"}
                </span>
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
              <div className="flex justify-evenly m-2 h-40 overflow-y-auto rounded-[2.5rem] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300">
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
        {/* Free slots */}
        <FreeSlots />
      </div>
    </div>
  );
}

export default MeetingsContainer;
