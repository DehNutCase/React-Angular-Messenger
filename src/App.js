import "./App.css";
import React, { useState } from "react";
import Preferences from "./components/Preferences/Preferences";
import Messenger from "./components/Messenger/Messenger";
import LoginPage from "./components/LoginPage/LoginPage";
import NavBar from "./components/NavBar/NavBar";
import UsersPage from "./components/UsersPage/UsersPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { STATES } from "mongoose";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  if (!token) {
    return <LoginPage setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <NavBar />
      <BrowserRouter>
        <Switch>
          <Route path="/messenger">
            <Messenger />
          </Route>
          <Route path="/usersPage">
            <UsersPage />
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
