import React, { useContext, useReducer } from "react";
import { isEmail, isPassword } from "../../helpers/validators";
import { Context } from "../../store/context-values";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    case "setPassword":
      return { ...state, password: action.password };
    case "setPasswordVal":
      if (isPassword.test(state.password)) {
        return { ...state, passwordVal: true };
      } else {
        return { ...state, passwordVal: false };
      }
    case "setFormVal":
      if (state.emailVal && state.passwordVal) {
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
function Login() {
  const setToken_context = useContext(Context).setToken;
  const setNotification_context = useContext(Context).setNotification;
  const setAlertModal_context = useContext(Context).setAlertModal;

  const navigate = useNavigate();

  const [loginForm, loginFormDispatch] = useReducer(formReducer, {
    email: "",
    emailVal: null,
    emailVal: null,
    password: "",
    passwordVal: null,
    formVal: null,
  });
  const login = async () => {
    if (loginForm.emailVal && loginForm.passwordVal) {
      setNotification_context({
        color: "blue",
        data: "Logging you in...",
        loading: true,
      });
      // _id
      //       email
      //       complaints{
      //         _id
      //         date_of_submit
      //         from
      //         department
      //         content
      //         location
      //         under_review
      //         processed
      //         image
      //       }
      //       reports{
      //         _id
      //         date_of_submit
      //         from
      //         content
      //         location
      //         under_review
      //         processed
      //         image
      //       }
      const queryData = {
        query: `{
          loginCitizen(email:"${loginForm.email}",password:"${loginForm.password}"){
            token
          }
        }`,
      };
      axios
        .post(process.env.REACT_APP_API, queryData)
        .then((response) => {
          if (response.data.data.loginCitizen) {
            console.log(response.data.data.loginCitizen.token);
            setToken_context(response.data.data.loginCitizen.token);
            setNotification_context({ color: "green", data: "Logged in !" });
            navigate("/dashboard/meetings");
          }
        })
        .catch(({ response }) => {
          setNotification_context({
            color: "red",
            data: response.data.errors[0].message,
          });
        });
    }
  };
  return (
    <div className=" mt-5 p-1 h-[78vh] flex flex-col gap-2">
      {/* Register Benefits */}
      {/* Register */}
      <div className="border-4 p-2 rounded-lg border-slate-400 flex flex-col gap-2">
        <span className="text-2xl font-medium tracking-wide text-center border-b-2 border-slate-400 pb-2">
          😄 WELCOME ‼
        </span>
        {!loginForm.emailVal && <span>Incorrect email !</span>}
        <input
          className="p-1 rounded-lg text-sm w-44"
          placeholder="Email 📧"
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
        {loginForm.emailVal && (
          <div className="flex flex-col gap-1">
            {!loginForm.passwordVal && <span>Incorrect pattern</span>}
            <input
              type="password"
              min={8}
              max={12}
              placeholder="password 🔑"
              className="p-1 rounded-lg text-sm w-44"
              onChange={(event) => {
                loginFormDispatch({
                  type: "setPassword",
                  password: event.target.value,
                });
                loginFormDispatch({ type: "setPasswordVal" });
                loginFormDispatch({ type: "setFormVal" });
              }}
              onBlur={() => {
                if (!loginForm.passwordVal) {
                  setAlertModal_context({
                    msg: `Password must be 8-12 characters long, contain a specical char and a captical letter`,
                    visible: true,
                  });
                }
              }}
            />
          </div>
        )}
        {loginForm.formVal && (
          <button
            onClick={login}
            className="border border-green-900  bg-green-300 rounded-lg w-16"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
