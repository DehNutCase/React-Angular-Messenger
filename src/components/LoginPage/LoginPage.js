import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import { render } from "@testing-library/react";

async function loginUser(credentials) {
  //careful with the URL here
  return fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function LoginPage({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await loginUser({
      username,
      password,
    });
    if (res.error) {
      alert(res.error);
      return;
    }
    const token = res.token;
    localStorage.setItem("token", token);
    setToken(token);
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            className="form-control"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

LoginPage.propTypes = {
  setToken: PropTypes.func.isRequired,
};
