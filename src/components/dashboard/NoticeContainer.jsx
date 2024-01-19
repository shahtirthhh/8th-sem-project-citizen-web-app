import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Context } from "../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function NoticeContainer() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;

  const [notices, setNotices] = useState(null);

  const fetchNotices = useMemo(() => {
    return async () => {
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
              notices{
                _id
                announcement_date
                content
              }
            }
          `),
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (data.errors) {
        setNotification_context({
          color: "red",
          data: "Something went wrong !",
        });
      } else {
        setNotification_context({
          color: "green",
          data: "Updated Just Now !",
        });
        setNotices(data.data.notices);
      }
    };
  }, []);

  useEffect(() => {
    fetchNotices();
  }, []);
  return (
    <div className="border-2 border-red-600 h-[86vh] w-[24rem] flex flex-col overflow-y-auto ">
      {!notices && <h2 className=" font-bold text-center">Loading...</h2>}
      {notices && notices.length < 1 && (
        <h2 className=" font-bold text-center">Empty Notice board !</h2>
      )}
      {notices && notices.length >= 1 && (
        <div className="bg-slate-200 flex flex-col items-center gap-2 p-2 sticky top-0 m-0">
          <span className="text-[1.5rem] font-semibold tracking-wide">
            🔔 NOTICE BOARD
          </span>
          <div className="flex gap-1">
            <label htmlFor="filter">New first</label>
            <input type="radio" name="filter" id="nradio1" />
            <label htmlFor="filter">Old first</label>
            <input type="radio" name="filter" id="nradio2" />
          </div>
          <input
            className="p-1 rounded-lg"
            type="text"
            name="nfilter"
            id="nfilter1"
            placeholder="🔎 Search..."
          />
        </div>
      )}
      {notices &&
        notices.length >= 1 &&
        notices.map((notice) => (
          <div
            key={notice._id}
            className="border-2 border-neutral-800 mx-1 my-2 p-1 flex flex-col h-[115vh] rounded-md"
          >
            <span className="text-[0.8rem] font-semibold text-neutral-500 border-b border-slate-200 pb-[0.10rem]">
              {notice.announcement_date}
            </span>
            <span className="whitespace-pre-line text-[1rem] border border-green-600">
              {notice.content}
            </span>
          </div>
        ))}
    </div>
  );
}

export default NoticeContainer;
