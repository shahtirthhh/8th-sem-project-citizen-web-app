import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/context-values";
import axios from "axios";
import Modal from "../UI/Modal";
import { useNavigate } from "react-router-dom";
const departments = [
  "Revenue",
  "Income Tax",
  "Food security",
  "Law & Order",
  "Public wellfare",
  "Other",
];
const query_generator = (query) => {
  return {
    query,
  };
};
const ComplaintsContainer = () => {
  const token = useContext(Context).token;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [images, setImages] = useState([]);
  const [imageStrings, setImageStrings] = useState([]);

  const [complaints, setComplaints] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (answer) {
      setShowModal(false);
      setAnswer(null);
      submit_complaint();
    } else {
      setShowModal(false);
      setAnswer(null);
    }
  }, [answer]);
  const submit_complaint = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Submitting...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            newComplaint(content:"""${content}""",location:"${location}",department:"${department}",image:${JSON.stringify(
        imageStrings
      )})
           }
        `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "💀 Something went wrong !",
      });
    } else {
      setNotification_context({
        color: "green",
        data: "👍🏻 Submitted !",
      });
    }
    navigate("/dashboard");
    // setContent("");
    // setLocation("");
    // setDepartment("");
    // setImageStrings([]);
    // setImages([]);
  };
  useEffect(() => {
    if (images.length < 1) {
      setImageStrings([]);
    }
    images.forEach((image) => {
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = () => {
          setImageStrings((prevState) => [...prevState, reader.result]);
        };
      }
    });
  }, [images]);
  useEffect(() => {
    fetchComplaints();
  }, []);
  const fetchComplaints = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Getting data...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          {
            myComplaints
            {
              _id
              date_of_submit
              seen
              from
              department
              content
              location
              under_review
              processed
              image
            }
          } 
        `),
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "💀 Something went wrong !",
      });
    } else {
      setNotification_context({
        color: "green",
        data: "🙌🏻 Updated just now !",
      });

      setComplaints(data.data.myComplaints);
    }
  };
  return (
    <div className="relative top-[-5.0rem] border-2 border-black rounded-[2.5rem] p-3  flex flex-col gap-2 w-[58rem]  h-[34rem] z-10 bg-teal-50 scrollbar-track-slate-300">
      <div className="flex gap-3 flex-col overflow-y-auto scrollbar scrollbar-thumb-slate-400 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg ">
        {/* Submit a complaint */}
        <div className="flex  flex-col px-2 border-2 border-black bg-amber-50  gap-5  rounded-[2.5rem] p-3">
          <span className="font-medium ml-3 ">
            👉🏻 Your feedback is valuable and helps us improve our services.
            Include any details or concerns you may have.
          </span>
          <textarea
            onChange={(event) => {
              setContent(event.target.value);
            }}
            className="border-2 border-black rounded-xl p-3 scrollbar scrollbar-thumb-slate-600 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg w-full"
            name="content"
            id="complaintContent"
            cols="30"
            rows="4"
            placeholder={`Please feel free to describe your complaint to the collector of Rajkot. `}
          />
          <div className="flex h-10 gap-3 ">
            <select
              className="p-1 rounded-xl border-2 border-black "
              onChange={(event) => {
                setDepartment(event.target.value);
              }}
              name="department"
              id="department"
              defaultValue="Department"
            >
              <option value="Department" disabled>
                Department
              </option>
              <option value="Revenue">Revenue</option>
              <option value="Income Tax">Income Tax</option>
              <option value="Food security">Food Security</option>
              <option value="Law & Order">Law & Order</option>
              <option value="Public wellfare">Public wellfare</option>
              <option value="Other">Other</option>
            </select>
            <input
              onChange={(e) => setLocation(e.target.value)}
              className="p-1 rounded-xl border-2 border-black "
              type="text"
              min={11}
              placeholder="Location"
            />
            <input
              multiple
              type="file"
              onChange={(e) => setImages([...e.target.files])}
              accept="image/*"
            ></input>
          </div>
          <div className=" flex gap-3 flex-wrap overflow-y-auto p-3 scrollbar scrollbar-thumb-slate-600 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg">
            {content.trim().length > 20 &&
            departments.includes(department) &&
            location.trim().length > 11 ? (
              <button
                onClick={() => {
                  setMsg(
                    `Confirm to submit a complaint \n (This action cannot be reversed ◀)`
                  );
                  setShowModal(true);
                }}
                className="h-fit text-base px-3 ml-3 w-fit hover:bg-green-500 hover:scale-105 transition-all bg-green-300 border-2 border-green-700  rounded-xl text-black font-semibold p-1"
              >
                Submit
              </button>
            ) : (
              <span className="font-medium ml-3">
                ✍🏻 Fill all details to submit !
              </span>
            )}
            {imageStrings.length >= 1 &&
              imageStrings.map((img) => (
                <img
                  src={img}
                  alt="img not found"
                  className="text-[0.4rem] w-24 h-24 rounded-lg"
                />
              ))}
          </div>

          <Modal msg={msg} showModal={showModal} onAnswer={setAnswer} />
        </div>

        {/* active  complaints */}
        <div className="  flex flex-col px-2 border-2 border-black bg-amber-50  gap-5  rounded-[2.5rem] p-3">
          <span className="font-semibold text-2xl text-center">
            Active complaints
          </span>
          {!complaints && (
            <span className="font-bold text-lg text-center">⌛ Loading...</span>
          )}
          {complaints && complaints.length < 1 && (
            <span className="font-bold text-lg text-center">
              🧾 No active complaints !
            </span>
          )}
          {complaints && complaints.length >= 1 && (
            <div className="p-3">
              {/* Container for 1 card for beautful scrollbar */}
              <div className="flex flex-col gap-3">
                {complaints.map((complaint) => {
                  if (!complaint.processed) {
                    return (
                      <div
                        className={`border-2 h-min-[7rem] h-max-[5rem] border-black p-3 roundex-[2.5rem] gap-3 rounded-3xl flex flex-col ${
                          complaint.under_review
                            ? "bg-blue-200"
                            : "bg-yellow-200"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium text-base text-center">
                            🗓 {complaint.date_of_submit}
                          </span>
                          <span
                            className={`font-medium text-base text-center${
                              complaint.under_review
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {complaint.under_review
                              ? "🔍 Under review"
                              : "⏳ Pending"}
                          </span>
                          <span className="font-medium text-base text-center">
                            {complaint.department}
                          </span>
                          <span className="font-medium text-base text-center">
                            📍 {complaint.location.slice(0, 20)}
                          </span>
                        </div>
                        <div className=" w-full">
                          <span
                            onDoubleClick={() => {
                              setAlertModal_context({
                                msg: complaint.content,
                                visible: true,
                              });
                            }}
                            className="font-medium text-base  whitespace-pre-line"
                          >
                            {complaint.content.slice(0, 50)} 💬
                          </span>
                        </div>
                        {complaint.image && complaint.image.length >= 1 && (
                          <div className=" flex gap-2 flex-wrap overflow-y-auto scrollbar scrollbar-thumb-slate-600 scrollbar-w-2 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg w-full">
                            {complaint.image.map((image) => {
                              return (
                                <img
                                  src={image}
                                  alt="image"
                                  className="h-[6rem] w-[6rem] rounded-xl"
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsContainer;
