import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};

function SuccessContainer() {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;

  const [stories, setStories] = useState(null);

  const fetchStories = useCallback(async () => {
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
              stories{
                _id
                publish_date
                content
                image
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
      setStories(data.data.stories);
    }
  }, [setNotification_context, token]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);
  return (
    <div className="border-2 border-red-600 p-1 h-[86vh] w-[24rem] flex flex-col overflow-y-auto ">
      {!stories && <h2 className=" font-bold text-center">Loading...</h2>}
      {stories && stories.length < 1 && (
        <h2 className=" font-bold text-center">Empty !</h2>
      )}
      {stories && stories.length >= 1 && (
        <div className="bg-slate-200 flex flex-col items-center gap-2 p-2 sticky top-0 m-0">
          <span className="text-[1.5rem] font-semibold tracking-wide">
            🏆 Success Stories
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
      {stories && stories.length >= 1 && (
        <div className="border border-black flex w-full h-full flex-wrap overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-300">
          {stories.map((story) => (
            <div
              key={story._id}
              className="border border-neutral-800 m-1 p-1 flex flex-col rounded-md overflow-y-auto"
            >
              <span className="text-[0.8rem] font-semibold text-neutral-500 border-b border-slate-200 pb-[0.10rem]">
                {story.publish_date}
              </span>
              {story.image.length >= 1 && (
                <div className="w-full flex flex-row flex-wrap">
                  {story.image.map((img) => (
                    <img
                      key={img}
                      className="w-full rounded-lg"
                      src={img}
                      alt="img"
                    />
                  ))}
                </div>
              )}
              <div className="whitespace-pre-line text-[1rem]">
                {story.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuccessContainer;
