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

  const [sort, setSort] = useState("old-first");
  const [notices, setNotices] = useState(null);
  const [filteredNotices, setFilteredNotices] = useState(notices);
  const [searchFilter, setSearchFilter] = useState("");
  useEffect(() => {
    setFilteredNotices(notices);
  }, [notices]);
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
  const sortNotices = () => {
    if (sort === "new-first" && notices) {
      filteredNotices.sort((a, b) => {
        // Convert the date strings to Date objects
        const dateA = new Date(a.announcement_date);
        const dateB = new Date(b.announcement_date);

        // Compare the dates (descending order)
        return dateB - dateA;
      });
    } else if (sort === "old-first" && notices) {
      filteredNotices.sort((a, b) => {
        // Convert the date strings to Date objects
        const dateA = new Date(a.announcement_date);
        const dateB = new Date(b.announcement_date);

        // Compare the dates (aescendig order)
        return dateA - dateB;
      });
    }
  };
  const filterOnSearch = () => {
    if (searchFilter.trim().length < 4) {
      setFilteredNotices(notices);
      setSort("old-first");
    } else {
      setFilteredNotices(
        notices.filter((notice) => notice.content.includes(searchFilter))
      );
      sortNotices();
    }
  };

  useEffect(() => {
    filterOnSearch();
  }, [searchFilter]);
  useEffect(() => {
    sortNotices();
  }, [sort]);
  useEffect(() => {
    fetchNotices();
  }, []);
  return (
    <div className=" h-[86vh] w-[24rem] flex flex-col overflow-y-auto">
      {!notices && <h2 className=" font-bold text-center">Loading...</h2>}
      {notices && notices.length < 1 && (
        <h2 className=" font-bold text-center">Empty Notice board !</h2>
      )}
      {notices && notices.length >= 1 && (
        <div className="bg-slate-200 flex flex-col items-center gap-2 p-2 sticky top-0 m-0">
          <span className="text-[1.5rem] font-semibold tracking-wide">
            🔔 NOTICE BOARD
          </span>
          <div className="flex gap-1 scrollbar-thin ">
            <label htmlFor="filter">Latest</label>
            <input
              checked={sort === "new-first"}
              type="radio"
              name="filter"
              id="nradio1"
              onChange={() => setSort("new-first")}
            />
            <label htmlFor="filter">Oldest</label>
            <input
              checked={sort === "old-first"}
              type="radio"
              name="filter"
              id="nradio2"
              onChange={() => setSort("old-first")}
            />
          </div>
          <input
            className="p-1 rounded-lg"
            type="text"
            name="nfilter"
            id="nfilter1"
            placeholder="🔎 Search..."
            onChange={(event) => setSearchFilter(event.target.value)}
          />
        </div>
      )}
      {filteredNotices && filteredNotices.length >= 1 && (
        <div className="border border-black flex w-full h-full flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300">
          {filteredNotices.map((notice) => (
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
      )}
    </div>
  );
}

export default NoticeContainer;
