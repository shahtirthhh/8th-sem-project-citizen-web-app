import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../store/context-values";

const query_generator = (query) => {
  return {
    query,
  };
};
function SuccessStories() {
  const setNotification_context = useContext(Context).setNotification;
  const [stories, setStories] = useState(null);

  const fetchStories = useCallback(async () => {
    setNotification_context({
      color: "blue",
      data: "Checking for data...",
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
  }, [setNotification_context]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);
  return (
    <div className="p-1 h-[80.5vh] flex">
      {/* Stories*/}
      <div className=" p-1 h-full w-full flex justify-center items-center">
        {!stories && <h2 className=" font-bold text-center">Loading...</h2>}
        {stories && stories.length < 1 && (
          <h2 className=" font-bold text-center">Empty !</h2>
        )}
        {stories && stories.length >= 1 && (
          <div className="flex w-full h-full flex-wrap overflow-y-auto">
            {stories.map((story) => (
              <div
                key={story._id}
                className="border border-neutral-800 m-3 p-2 flex flex-col w-64 h-72 rounded-2xl overflow-y-auto shadow-[0px_0px_12px_0px_#718096]"
              >
                <span className="text-[1rem] font-normal text-neutral-500 border-b border-slate-200 pb-[0.10rem]">
                  {story.publish_date}
                </span>
                {story.image.length >= 1 && (
                  <div className="w-full flex flex-row flex-wrap scrollbar-thin  scrollbar-thumb-slate-700 scrollbar-track-slate-300 h-32 overflow-y-scroll ">
                    {story.image.map((img) => (
                      <img
                        key={img}
                        className="w-full rounded-md my-1"
                        src={img}
                        alt="img"
                      />
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-line text-lg font-medium">
                  {story.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessStories;
