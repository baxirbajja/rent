import React, { useState } from "react";
import "./Login.css";
// import MyLogin from "../images/login.jpg";

export default function Login() {
  const [action, setAction] = useState("Sign Up");

  return (
    <div className="container">
      <div className="content">
        <div className="form-container">
          <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
          </div>
          <div className="inputs">
            {action === "Sign Up" && (
              <div className="input">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" />
              </div>
            )}

            <div className="input">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" />
            </div>

            <div className="input">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" />
            </div>

            {action === "Login" && (
              <div className="forgot-password">
                Lost password ?<span>Click here!</span>
              </div>
            )}

            <div className="submit-container">
              {/* Sign Up button */}
              <div
                className={action === "Login" ? "submit gray" : "submit"}
                onClick={() => setAction("Sign Up")}
              >
                Sign Up
              </div>

              {/* Login button */}
              <div
                className={action === "Sign Up" ? "submit gray" : "submit"}
                onClick={() => setAction("Login")}
              >
                Login
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
