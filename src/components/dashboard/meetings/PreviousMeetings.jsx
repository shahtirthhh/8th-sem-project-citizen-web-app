import React, { useContext, useEffect, useState } from "react";
// import { isEmail, isPassword, isNumbers } from "../../../helpers/validators";
import { Context } from "../../../store/context-values";
import axios from "axios";
// import { Outlet } from "react-router-dom";

const query_generator = (query) => {
  return {
    query,
  };
};
function PreviousMeetings() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const [previousMeetings, setPreviousMeetings] = useState(null);
  const fetchData = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Getting data...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
      {
        myMeeting{
          meetings{
            _id
            date_of_submit
            date
            slot
            overview
            confirm
            cancel
            reason_to_cancel
            happen
            reason_to_not_happen
            missed
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
      console.log(data.data.myMeeting.meetings);
      setPreviousMeetings(data.data.myMeeting.meetings);
      setNotification_context({
        color: "green",
        data: "🎉 Updated Just Now !",
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      className={`relative top-[-5.0rem] border-2 border-black rounded-[2.5rem] p-3  flex flex-col gap-2 w-[58rem]  h-[34rem] z-10 bg-white`}
    >
      {previousMeetings && previousMeetings.length >= 1 && (
        <span className="text-xl font-semibold text-center p-2 w-full">
          Previous Meetings
        </span>
      )}
      {!previousMeetings && (
        <span className="text-base font-semibold text-center p-2 w-full">
          Loading...
        </span>
      )}
      {previousMeetings && previousMeetings.length < 1 && (
        <span className="text-lg font-semibold text-center p-2 w-full">
          👎🏻 No previous meetings !
        </span>
      )}
      {previousMeetings && previousMeetings.length >= 1 && (
        <ul className="w-full flex flex-col gap-4 h-[34rem] rounded-[2.5rem] overflow-y-auto  scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300">
          {previousMeetings.map((meeting) => {
            return (
              <li
                key={meeting._id}
                className="w-full flex flex-col gap-4 h-full rounded-[2.5rem]"
              >
                <div
                  className={`border-2 border-black flex rounded-[2.5rem] p-2 justify-center ${
                    meeting.confirm
                      ? meeting.happen
                        ? "bg-emerald-300"
                        : "bg-yellow-300"
                      : meeting.cancel
                      ? "bg-red-300"
                      : meeting.missed
                      ? "bg-gray-300"
                      : ""
                  }`}
                >
                  <div className=" w-full flex flex-col gap-4 h-full rounded-[2.5rem]">
                    {/* Dates, status, reason to cancel  and date/timings */}
                    <div className="flex pt-1 mb-2 gap-40">
                      <span className="ttext-sm pl-5 font-semibold text-left w-[13rem] whitespace-pre-line">
                        Requested on {"\n"}
                        {meeting.date_of_submit}
                      </span>
                      <span className="text-sm font-semibold text-left w-[17rem] whitespace-pre-line">
                        {meeting.confirm
                          ? `✔ was confirmed ${
                              meeting.happen
                                ? ""
                                : `\n🙅🏻‍♂️ but you didn't joined `
                            }`
                          : meeting.cancel
                          ? "❌ was canceled"
                          : meeting.missed
                          ? "😿 Missed by the collector"
                          : ""}
                      </span>
                      <span className="text-sm font-semibold text-left w-[22rem]">
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
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PreviousMeetings;
