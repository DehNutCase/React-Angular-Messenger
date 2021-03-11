import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:3001";
var jwt = require("jsonwebtoken");

export default function Messenger() {
  const payload = jwt.decode(localStorage.getItem("token"));
  const username = payload.username;

  useEffect(() => {
    const socket = io(ENDPOINT);

    var form = document.getElementById("form");
    var input = document.getElementById("input");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value) {
        socket.emit("chat message", input.value);
        input.value = "";
      }
    });

    socket.on("chat message", function (msg) {
      var item = document.createElement("li");
      item.textContent = username + ": " + msg;
      item.className = "list-group-item";
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
  }, []);

  return (
    <div>
      <div className="card" style={{ margin: "10px" }}>
        <ul id="messages" className="list-group"></ul>
      </div>
      <div style={{ margin: "10px" }}>
        <form id="form" action="">
          <div className="form-group">
            <input id="input" className="form-control" />
          </div>
          <div className="form-group">
            <button className="btn btn-success">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
