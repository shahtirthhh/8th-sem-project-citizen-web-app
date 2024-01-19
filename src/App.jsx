import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Context } from "./store/context-values";
import { useContext, useEffect } from "react";
import Waiting from "./pages/Waiting";
import io from "socket.io-client";

import HomePage from "./pages/Homepage";
import PreviousMeetings from "./components/dashboard/meetings/PreviousMeetings";
import Dashboard from "./pages/Dashboard";
import MeetingsContainer from "./components/dashboard/MeetingsContainer";
import ComplaintsContainer from "./components/dashboard/ComplaintsContainer";
import ReportsContainer from "./components/dashboard/ReportsContainer";
import Notification from "./components/UI/Notification";
import AlertModal from "./components/UI/AlertModal";
import RequestMeeting from "./components/dashboard/meetings/RequestMeeting";
const ROUTER = createBrowserRouter([
  // Homepage paths
  {
    path: "/",
    element: <HomePage />,
  },
  // Dashboard paths
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "meetings",
        element: <MeetingsContainer />,
      },
      {
        path: "request-meeting",
        element: <RequestMeeting />,
      },
      { path: "previous-meetings", element: <PreviousMeetings /> },
      { path: "complaints", element: <ComplaintsContainer /> },
      { path: "reports-activities", element: <ReportsContainer /> },
    ],
  },
]);
// socketObject -> Object of the socket
// socket -> id of the socket
const socketObject = io.connect(process.env.REACT_APP_DOMAIN);
function App() {
  const function_setSocket = useContext(Context).setSocketObject;
  const function_setSocketId = useContext(Context).setSocket;
  useEffect(() => {
    socketObject.on("get_my_socket_id", (id) => {
      function_setSocket(socketObject);
      function_setSocketId(id);
    });
  }, [socketObject]);
  if (!socketObject.connected) {
    return <Waiting />;
  } else {
    return (
      <div>
        <RouterProvider router={ROUTER}></RouterProvider>
        <Notification />
        <AlertModal />
      </div>
    );
  }
}

export default App;
