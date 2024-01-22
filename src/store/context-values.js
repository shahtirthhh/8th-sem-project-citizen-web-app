import React, { useState } from "react";

export const Context = React.createContext({
  token: null,
  setToken: (token) => {},
  socket: null,
  setSocket: (socket) => {},
  socketObject: null,
  setSocketObject: (socket) => {},
  notification: { color: null, data: null },
  setNotification: ({ color, data, loading = false }) => {},
  alertModal: { msg: "", visible: "" },
  setAlertModal: ({ msg, visible }) => {},
  peerSignalData: { signal: null, from: null },
  setPeerSignalData: ({ signal, from }) => {},
});
// eslint-disable-next-line
export default (props) => {
  const [tokenValue, setTokenValue] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpcnRoc2hhaDAyMTJAZ21haWwuY29tIiwiX2lkIjoiNjVhOTU5MGQ2YjNiZGFiOWRjNDJiYTkwIiwiaWF0IjoxNzA1OTQyMTcyLCJleHAiOjE3MDYwMjg1NzJ9.Xtm0jN77aZ_KnpvgHJ-FsNkqnmS8P7J6VlzM_0BCqUA"
  );
  const [socketObjectValue, setSocketObjectValue] = useState(null);
  const [socketValue, setSocketValue] = useState(null);
  const [notificationValue, setNotificationValue] = useState({
    color: "null",
    data: "null",
    loading: false,
  });
  const [alertModalValue, setAlertModalValue] = useState({
    msg: "",
    visible: false,
  });
  const [peerSignalDataValue, setPeerSignalDataValue] = useState({
    signal: null,
    from: null,
  });
  return (
    <Context.Provider
      value={{
        token: tokenValue,
        socket: socketValue,
        socketObject: socketObjectValue,
        notification: notificationValue,
        alertModal: alertModalValue,
        peerSignalData: peerSignalDataValue,
        setPeerSignalData: setPeerSignalDataValue,
        setToken: setTokenValue,
        setSocket: setSocketValue,
        setNotification: setNotificationValue,
        setSocketObject: setSocketObjectValue,
        setAlertModal: setAlertModalValue,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
