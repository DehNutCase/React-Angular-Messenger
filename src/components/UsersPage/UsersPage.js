import { computeHeadingLevel } from "@testing-library/dom";
import React, { useState, useEffect } from "react";

export default function UserPage() {
  const [userList, setUserList] = useState([]);
  var elementList = [];
  useEffect(() => {
    fetch("http://localhost:3001/users", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserList(data);
      });
  }, []);

  if (userList.length > 0) {
    let i = 0;
    for (let user of userList) {
      let element = <UserForm user={user} key={i} />;
      elementList.push(element);
      i++;
    }

    let button = (
      <button
        key={"button"}
        onClick={() => {
          addUser().then((data) => {
            console.log(data);
            window.location.reload(false);
          });
        }}
      >
        Add User
      </button>
    );
    elementList.push(button);
    return elementList;
  } else {
    return <div>Hi</div>;
  }
}

async function updateUser(credentials) {
  //careful with the URL here
  return fetch("http://localhost:3001/updateUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

async function deleteUser(credentials) {
  return fetch("http://localhost:3001/deleteUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => {
    console.log(data);
    return data.json();
  });
}

async function addUser() {
  return fetch("http://localhost:3001/createUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "newuser",
      password: "password",
      email: "new@email.com",
    }),
  }).then((data) => {
    return data.json();
  });
}

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.user.username,
      password: props.user.password,
      email: props.user.email,
    };

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.delete = this.delete.bind(this);
  }

  delete(event) {
    event.preventDefault();
    let user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
    };
    console.log("Deleting user!");
    deleteUser(user)
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        window.location.reload(false);
      });
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    console.log("Submitted :" + JSON.stringify(this.state));
    event.preventDefault();

    let user = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
    };

    console.log("updating user!");
    updateUser(user).then((data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <li className="list-group-item">
        <form
          onSubmit={() => {
            this.handleSubmit;
          }}
        >
          <div>
            <h4>Username: {this.state.username}</h4>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              value={this.state.password}
              onChange={this.changePassword}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.changeEmail}
            />
          </div>

          <input type="submit" value="Submit" className="m-1" />
        </form>
        <button onClick={this.delete} className="m-1">
          Delete User
        </button>
      </li>
    );
  }
}
