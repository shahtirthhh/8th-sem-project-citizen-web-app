import React from "react";

function Modal({ msg, showModal, onAnswer }) {
  return (
    <>
      {showModal && (
        <dialog className="z-20 w-full h-full fixed top-0 left-0 bg-black/25 backdrop-blur-md flex justify-center items-center">
          <div className="border rounded-xl bg-white/70 w-2/5  flex flex-col gap-3 justify-evenly">
            <span className="text-lg text-center font-bold whitespace-pre-line">
              {msg}
            </span>
            <div className="flex flex-row mt-20 justify-center">
              <button
                onClick={() => onAnswer(true)}
                className="text-2xl border text-white bg-green-600 border-black py-1 px-2 w-1/3 rounded-lg m-2 font-semibold"
              >
                CONFIRM
              </button>
              <button
                onClick={() => onAnswer(false)}
                className="text-2xl bg-red-600 text-white border border-black py-1 px-2 w-1/3 rounded-lg m-2 font-semibold"
              >
                CANCEL
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default Modal;
