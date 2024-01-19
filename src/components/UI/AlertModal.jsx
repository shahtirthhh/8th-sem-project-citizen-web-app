import { Context } from "../../store/context-values";
import React, { useContext } from "react";
function AlertModal() {
  const setAlertModalContext = useContext(Context).setAlertModal;
  const alertModalContext = useContext(Context).alertModal;
  return (
    <>
      {alertModalContext.visible && (
        <dialog className="z-20 w-full h-full absolute top-0 left-0 bg-black/25 backdrop-blur-md flex justify-center items-center">
          <div className="border rounded-xl bg-white/70 w-2/5 flex flex-col gap-3 justify-center">
            <span className="text-lg text-center font-bold">
              {alertModalContext.msg}
            </span>
            <div className="flex flex-row mt-20 justify-center">
              <button
                onClick={() =>
                  setAlertModalContext({ msg: "", visible: false })
                }
                className="text-2xl border text-white bg-blue-400 border-black py-1 px-2 w-24 rounded-lg m-2 font-semibold"
              >
                OKAY
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default AlertModal;
