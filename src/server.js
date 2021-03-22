const express = require("express");
const mongoose = require("mongoose");
var db = mongoose
  .connect("mongodb://127.0.0.1:27017/messengerBackend")
  .catch((err) => {
    console.log(err);
  });
var user = require("./models/userModel");
var app = express();
var cors = require("cors");
app.use(cors());
var port = process.env.PORT || 3001;
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/users", (req, res) => {
  console.log("There was a userlist fetch");
  user
    .find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/createUser", (req, res) => {
  if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password);
  let newUser = user(req.body);
  console.log(req.body);
  newUser.validate((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      newUser.save((err) => {
        if (err) return handleError(err);
        user.find(newUser).then((data) => {
          res.send(data);
        });
      });
    }
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  //Note we're assuming usernames are unique, currently this is not guaranteed
  user
    .findOne({ username: req.body.username })
    .then((data) => {
      if (data) {
        let same = bcrypt.compareSync(req.body.password, data.password);
        if (same) {
          //passwords are the same, let's return a token

          //manually setting the expiration here
          data = JSON.stringify(data);
          data = JSON.parse(data);
          data.exp = Math.floor(Date.now() / 1000) + 60 * 60;

          something = jwt.sign(JSON.stringify(data), "secretkey");
          res.send({ token: something });
        } else {
          res.status(401).send({ error: "Password did not match!" });
        }
      } else {
        res.status(401).send({ error: "Username not found!" });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/updateUser", (req, res) => {
  console.log(req.body);
  let query = { username: req.body.username };
  if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password);
  let newValues = { $set: req.body };
  user.updateOne(query, newValues, (err) => {
    if (err) throw err;
    console.log(`${JSON.stringify(query)} updated!`);
    user
      .findOne(query)
      .then((data) => {
        console.log(data);
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
});

app.post("/deleteUser", (req, res) => {
  console.log(req.body);
  user
    .findOne({ username: req.body.username })
    .then((data) => {
      if (data) {
        let same = bcrypt.compareSync(req.body.password, data.password);
        //temporarily disabled checking passwords before deletion
        same = true;
        if (same) {
          user
            .deleteOne({ username: req.body.username }, (err) => {
              if (err) {
                res.status(500).send(err);
              }
            })
            .then(() => {
              user.findOne({ username: req.body.username }).then((data) => {
                if (data) {
                  res.send({
                    error:
                      "Something went wrong, the username is still in the database",
                  });
                } else {
                  res.send({ message: "Deletion successful!" });
                }
              });
            });
        } else {
          res
            .status(401)
            .send({ error: "Password did not match! Deletion aborted." });
        }
      } else {
        res.status(401).send({ error: "Username not found!" });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// const httpServer = require("http").createServer(app);
server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

//note socket.io CORS settings need to be set manually
//just using cors() does *not* work
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
