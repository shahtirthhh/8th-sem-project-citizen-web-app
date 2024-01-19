import React, { useState } from "react";
import NoticeBoard from "./NoticeBoard";
import SuccessStories from "./SucessStories";

export default function LeftContainer() {
  const [active, setActive] = useState("notice");
  return (
    <div className="w-[60%] border-2 border-white flex flex-col justify-between bg-gradient-to-r from-cyan-400 to-white p-1">
      {/* Navigation panel */}
      <div className="flex flex-row w-auto justify-center gap-2">
        <button
          onClick={() => setActive("notice")}
          className={` uppercase text-md font-medium p-1 ${
            active === "notice" ? "border-b-2 border-purple-700" : ""
          }`}
        >
          Notice Board
        </button>
        <button
          onClick={() => setActive("success")}
          className={`uppercase text-md font-medium p-1 ${
            active === "success" ? "border-b-2 border-purple-700" : ""
          }`}
        >
          Success Stories
        </button>
      </div>
      {/* Active block */}
      {active === "notice" && <NoticeBoard />}
      {active === "success" && <SuccessStories />}
    </div>
  );
}
