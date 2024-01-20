import React, { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "../../store/context-values";
import axios from "axios";

const query_generator = (query) => {
  return {
    query,
  };
};

function NoticeBoard() {
  const setNotification_context = useContext(Context).setNotification;

  const [notices, setNotices] = useState(null);

  const fetchNotices = useMemo(() => {
    return async () => {
      setNotification_context({
        color: "blue",
        data: "🧘🏻 Checking for data...",
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
      });
      if (data.errors) {
        setNotification_context({
          color: "red",
          data: "⚠ Something went wrong !",
        });
      } else {
        setNotification_context({
          color: "green",
          data: "🎉 Updated Just Now !",
        });
        setNotices(data.data.notices);
      }
    };
  }, []);
  useEffect(() => {
    fetchNotices();
  }, []);
  return (
    <div className="p-1 h-[86vh] flex">
      {/* Notice Board */}
      {!notices && <h2 className=" font-bold text-center">Loading...</h2>}
      {notices && notices.length < 1 && (
        <h2 className=" font-bold text-center">Empty Notice board !</h2>
      )}
      {notices && notices.length >= 1 && (
        <div className="flex w-full h-full flex-wrap overflow-y-auto ">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="border border-neutral-800 mx-2 my-1 p-2 flex flex-col w-full h-auto rounded-lg overflow-y-auto overflow-x-hidden shadow-[0px_0px_12px_0px_#718096] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300"
            >
              <span className="text-[1rem] font-normal text-neutral-500 border-b border-slate-200 pb-[0.10rem]">
                {notice.announcement_date}
              </span>
              <span className="whitespace-pre-line text-lg font-medium">
                {notice.content}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoticeBoard;
