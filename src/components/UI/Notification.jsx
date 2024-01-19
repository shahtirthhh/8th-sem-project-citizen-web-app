import { Context } from "../../store/context-values";
import React, { useContext, useEffect } from "react";

export default function Notification() {
  const notification_context = useContext(Context).notification;
  const setNotification_context = useContext(Context).setNotification;
  useEffect(() => {
    var timeout;
    if (!notification_context.loading) {
      timeout = setTimeout(() => {
        setNotification_context({
          color: "null",
          data: "null",
          loading: false,
        });
      }, 1500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [notification_context.color]);
  switch (notification_context.color) {
    case "red":
      return (
        <div className="w-screen h-8 pl-4 pt-1 absolute bottom-[1vw] flex justify-between  bg-red-500">
          <span className="ml-4">Error !</span>
          <span className="mr-4">{notification_context.data}</span>
        </div>
      );
    case "blue":
      return (
        <div className="w-screen h-8 pl-4 pt-1 absolute bottom-[1vw] flex justify-between  bg-blue-500">
          <span className="ml-4">Loading...</span>
          <span className="mr-4">{notification_context.data}</span>
        </div>
      );
    case "green":
      return (
        <div className="w-screen h-8 pl-4 pt-1 absolute bottom-[1vw] flex justify-between  bg-green-500">
          <span className="ml-4">Success !</span>
          <span className="mr-4">{notification_context.data}</span>
        </div>
      );
    case "null":
      return <></>;
    default:
      break;
  }
}
