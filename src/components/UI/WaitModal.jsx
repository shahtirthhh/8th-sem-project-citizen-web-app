import React from "react";
function WaitModal() {
  return (
    <>
      <dialog className="z-20 w-full h-full fixed top-0 left-0 bg-black/25 backdrop-blur-md flex justify-center items-center">
        {/* <div className="border max-h-[30rem] min-h-[10rem] rounded-xl bg-white/70 max-w-[60rem] min-w-[25rem] flex flex-col gap-3 justify-between items-center p-3 overflow-y-auto scrollbar scrollbar-thumb-white scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-transparent "> */}
        <span className="text-2xl text-center font-bold whitespace-pre-line ">
          Please wait... 🙊
        </span>
        {/* </div> */}
      </dialog>
    </>
  );
}

export default WaitModal;
