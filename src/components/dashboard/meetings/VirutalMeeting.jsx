import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../../store/context-values";
import Header from "../../homepage/Header";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";
const started_on = new Date();
function VirutalMeeting() {
  // const socket_context = useContext(Context).socket;
  const socketObject_context = useContext(Context).socketObject;
  const peerSignalData_context = useContext(Context).peerSignalData;
  const setPeerSignalData_context = useContext(Context).setPeerSignalData;
  const setNotification_context = useContext(Context).setNotification;
  //   const setAlertModal_context = useContext(Context).setAlertModal;
  const [time, setTime] = useState(null);
  const [duration, setDuration] = useState(null);

  const [stream, setStream] = useState();
  const navigate = useNavigate();
  //   const [callerSignal, setCallerSignal] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const calculateDuration = (currentTime) => {
    const startTime = new Date(started_on);
    const elapsedTime = currentTime - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // Format the duration as HH:MM:SS
    const formattedDuration = `${hours}:${String(minutes % 60).padStart(
      2,
      "0"
    )}:${String(seconds % 60).padStart(2, "0")}`;
    return formattedDuration;
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: myVideo.current.srcObject,
        });
        peer.on("signal", (data) => {
          //   console.log(data);
          socketObject_context.emit("answerCall", {
            signal: data,
            to: peerSignalData_context.from,
          });
        });
        peer.on("stream", (stream) => {
          console.log(stream);
          userVideo.current.srcObject = stream;
        });
        console.log(peerSignalData_context);
        peer.signal(peerSignalData_context.signal);
        connectionRef.current = peer;
      });
    setInterval(() => {
      const currentTime = new Date();
      setTime(currentTime.toLocaleTimeString());
      setDuration(calculateDuration(currentTime));
    }, 1000);
    socketObject_context.on("end-call", () => {
      myVideo.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      setPeerSignalData_context({ signal: null, from: null });
      setNotification_context({ color: "green", data: "🙋🏻‍♂️ Meeting ended !" });
      connectionRef.current = null;
      myVideo.current.srcObject = null;
      navigate("/dashboard");
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="flex border w-full justify-center border-black items-start h-[44rem] bg-slate-200 p-5 pt-20">
        <video
          ref={userVideo}
          autoPlay
          className="rounded-xl m-1 border-2 border-black"
          style={{ width: "40rem" }}
        />
        <div className="flex flex-col items-left   gap-3">
          <video
            autoPlay
            ref={myVideo}
            muted
            className="rounded-xl m-1 border-2 border-black"
            style={{ width: "25rem" }}
          ></video>
          <div className=" border-2 border-black rounded-xl bg-white/70  flex flex-col gap-3 p-2">
            <span className="text-left  w-full px-5 font-medium text-lg">
              📆 {new Date().toDateString()}
            </span>
            <span className="text-left  w-full px-5 font-medium text-lg">
              🕔 {time}
            </span>
            <span className="text-left  w-full px-5 font-medium text-lg">
              📞 {duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirutalMeeting;
