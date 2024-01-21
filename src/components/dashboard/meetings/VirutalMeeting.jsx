import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../../store/context-values";
import Header from "../../homepage/Header";
import Peer from "simple-peer";

function VirutalMeeting() {
  const socket_context = useContext(Context).socket;
  const socketObject_context = useContext(Context).socketObject;
  const peerSignalData_context = useContext(Context).peerSignalData;
  //   const setNotification_context = useContext(Context).setNotification;
  //   const setAlertModal_context = useContext(Context).setAlertModal;
  const [stream, setStream] = useState();
  //   const [callerSignal, setCallerSignal] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
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
  }, []);

  return (
    <div>
      <Header />
      {/* {!callAccepted && <button onClick={callUser}>Start Call</button>} */}
      <video autoPlay ref={myVideo} muted style={{ width: "300px" }}></video>
      <video ref={userVideo} autoPlay style={{ width: "300px" }} />
      {/* {callAccepted && <button>End Call</button>} */}
    </div>
  );
}

export default VirutalMeeting;
