import "./App.css";
import React, { useState } from "react";
import Preferences from "./components/Preferences/Preferences";
import Messenger from "./components/Messenger/Messenger";
import LoginPage from "./components/LoginPage/LoginPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { STATES } from "mongoose";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  if (!token) {
    return <LoginPage setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <h6>Nav Bar Here</h6>
      <BrowserRouter>
        <Switch>
          <Route path="/messenger">
            <Messenger />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
