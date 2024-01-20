import React, { useContext, useReducer, useState } from "react";
import { isEmail, isPassword, isNumbers } from "../../helpers/validators";
import { Context } from "../../store/context-values";
import axios from "axios";

const formReducer = (state, action) => {
  switch (action.type) {
    case "setEmail":
      return { ...state, email: action.email };
    case "setEmailVal":
      if (isEmail(state.email)) {
        return { ...state, emailVal: true };
      } else {
        return { ...state, emailVal: false };
      }
    case "setOTP":
      return { ...state, OTP: action.OTP };
    case "setOTPVal":
      if (isNumbers.test(state.OTP) && state.OTP.trim().length === 4) {
        return { ...state, OTPVal: true };
      } else {
        return { ...state, OTPVal: false };
      }
    case "setVerified":
      return { ...state, verified: true };
    case "setPassword":
      return { ...state, password: action.password };
    case "setPasswordVal":
      if (isPassword.test(state.password)) {
        return { ...state, passwordVal: true };
      } else {
        return { ...state, passwordVal: false };
      }
    case "setConfirmPassword":
      return { ...state, confirm_password: action.confirm_password };
    case "setConfirmPasswordVal":
      if (state.confirm_password === state.password) {
        return { ...state, confirmPasswordVal: true };
      } else {
        return { ...state, confirmPasswordVal: false };
      }
    case "setFormVal":
      if (
        state.emailVal &&
        state.passwordVal &&
        state.confirmPasswordVal &&
        state.verified
      ) {
        return { ...state, formVal: true };
      } else {
        return { ...state, formVal: false };
      }
    default:
      break;
  }
};

const query_generator = (query) => {
  return {
    query,
  };
};
function Register() {
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;

  const [encrypted_otp, set_encrypted_otp] = useState(null);
  const [registered, setRegistered] = useState(false);

  const [loginForm, loginFormDispatch] = useReducer(formReducer, {
    email: "",
    emailVal: null,
    OTP: "",
    OTPVal: false,
    verified: false,
    password: "",
    passwordVal: null,
    confirm_password: "",
    confirmPasswordVal: null,
    formVal: null,
  });
  const verify_email = async () => {
    setNotification_context({
      color: "blue",
      data: "📨 Verifing Email...",
      loading: true,
    });
    axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            sendOtp(email:"${loginForm.email}")
          }
        `),
    })
      .then(({ data }) => {
        setNotification_context({
          color: "green",
          data: "🔢 OTP sent !",
        });
        set_encrypted_otp(data.data.sendOtp);
      })
      .catch(({ response }) => {
        setNotification_context({
          color: "red",
          data: "⚠ " + response.data.errors[0].message,
        });
      });
  };
  const check_otp = async () => {
    setNotification_context({
      color: "blue",
      data: "⏳ Validating...",
      loading: true,
    });
    const { data } = await axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            verifyOtp(otp:"${loginForm.OTP}",enc:"${encrypted_otp}")
          }
        `),
    });
    if (data.errors) {
      setNotification_context({
        color: "red",
        data: "⚠ Something went wrong !",
      });
    } else {
      if (data.data.verifyOtp) {
        setNotification_context({
          color: "green",
          data: "🎉 Verified !",
        });
        loginFormDispatch({ type: "setVerified" });
        set_encrypted_otp(null);
      } else {
        setNotification_context({
          color: "red",
          data: "☠ Incorrect OTP !",
        });
      }
    }
  };
  const register = async () => {
    setNotification_context({
      color: "blue",
      data: "💾 Registering...",
      loading: true,
    });
    axios({
      method: "post", //you can set what request you want to be
      url: process.env.REACT_APP_API,
      data: query_generator(`
          mutation{
            register(email:"${loginForm.email}",password:"${loginForm.password}")
          }
        `),
    })
      .then(({ data }) => {
        setNotification_context({
          color: "green",
          data: "🎊 Registered, Login to continue !",
        });
        setRegistered(data.data.register);
      })
      .catch(({ response }) => {
        setNotification_context({
          color: "red",
          data: "⚠ " + response.data.errors[0].message,
        });
      });
  };
  return (
    <div className=" mt-5 p-1 flex flex-col gap-2 h-[78vh]">
      {/* Register Benefits */}
      <ul className="border-4 p-2 rounded-lg border-slate-400">
        <span className="text-lg font-medium tracking-wide">
          Register to use features like...
        </span>
        <li className="pl-3 text-base tracking-wide">
          ✔ e-Complaint/Resolution
        </li>
        <li className="pl-3 text-base tracking-wide">
          ✔ Virtual meeting with collector
        </li>
        <li className="pl-3 text-base tracking-wide">
          ✔ Report suspicious activities without revealing identity{" "}
        </li>
      </ul>
      {/* Register */}
      <div className="border-4 p-2 rounded-lg border-slate-400 flex flex-col gap-2">
        {!loginForm.emailVal && <span>Incorrect email !</span>}
        {!loginForm.verified && (
          <input
            className="p-1 rounded-lg text-sm w-44"
            placeholder="Email"
            type="email"
            name="email"
            id="email"
            onChange={(event) => {
              loginFormDispatch({
                type: "setEmail",
                email: event.target.value,
              });
              loginFormDispatch({ type: "setEmailVal" });
              loginFormDispatch({ type: "setFormVal" });
            }}
          />
        )}
        {loginForm.verified && <span>✅ {loginForm.email}</span>}
        {loginForm.emailVal && !loginForm.verified && (
          <button
            onClick={verify_email}
            className="border border-blue-900  bg-blue-500 px-1 rounded-lg w-20"
          >
            Send OTP
          </button>
        )}
        {encrypted_otp && (
          <>
            {!loginForm.OTPVal && <span>Please enter 4 digit OTP</span>}
            <input
              type="text"
              min={4}
              max={4}
              placeholder="4 digit OTP"
              className="p-1 rounded-lg text-sm w-20"
              onChange={(event) => {
                loginFormDispatch({
                  type: "setOTP",
                  OTP: event.target.value,
                });
                loginFormDispatch({ type: "setOTPVal" });
              }}
            />
            {loginForm.OTPVal && encrypted_otp && (
              <button
                onClick={check_otp}
                className="border border-blue-900  bg-blue-500 rounded-lg w-16"
              >
                Verify
              </button>
            )}
          </>
        )}
        {loginForm.verified && !registered && (
          <>
            <div className="flex flex-col gap-1">
              {!loginForm.passwordVal && <span>Incorrect pattern</span>}
              <input
                type="password"
                min={8}
                max={12}
                placeholder="password"
                className="p-1 rounded-lg text-sm w-44"
                onChange={(event) => {
                  loginFormDispatch({
                    type: "setPassword",
                    password: event.target.value,
                  });
                  loginFormDispatch({ type: "setPasswordVal" });
                  loginFormDispatch({ type: "setFormVal" });
                }}
                onBlur={(event) => {
                  if (!loginForm.passwordVal) {
                    setAlertModal_context({
                      msg: `Password must be 8-12 characters long, contain a specical char and a captical letter`,
                      visible: true,
                    });
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              {!loginForm.confirmPasswordVal && (
                <span>Passwords must match</span>
              )}
              <input
                type="password"
                min={8}
                max={12}
                placeholder="confirm password"
                className="p-1 rounded-lg text-sm w-44"
                onChange={(event) => {
                  loginFormDispatch({
                    type: "setConfirmPassword",
                    confirm_password: event.target.value,
                  });
                  loginFormDispatch({ type: "setConfirmPasswordVal" });
                  loginFormDispatch({ type: "setFormVal" });
                }}
              />
            </div>
          </>
        )}
        {loginForm.verified && loginForm.formVal && !registered && (
          <button
            onClick={register}
            className="border border-green-900  bg-green-300 rounded-lg w-16"
          >
            Submit
          </button>
        )}
        {registered && (
          <>
            <span>✅ Registered</span>
            <span>▶ Login to continue</span>
          </>
        )}
      </div>
      {/* Portal usecases */}
      <ul className="border-4 p-2 rounded-lg border-slate-400 flex flex-col gap-3">
        <span className="text-lg font-medium tracking-wide">
          👉🏻 Overview of "REPORTING AND RESOLUTION PORTAL"
        </span>
        <li className="pl-3 text-base tracking-wide">
          📝 Notice Board :- Online notice/public notification accounced by
          collector.
        </li>
        <li className="pl-3 text-base tracking-wide">
          🥇 Success Stories :- E-magazine where achivements of citizen of
          rajkot are published.
        </li>
        <li className="pl-3 text-base tracking-wide">
          🕵🏻‍♂️ Place Report :- Report suspicious/illegeal activities without
          reveal who you are.
        </li>
        <li className="pl-3 text-base tracking-wide">
          📨 Complaints :- Send complaints of any concern department w/o images
          directely to the collector.
        </li>
      </ul>
    </div>
  );
}

export default Register;
