const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const helmet = require('helmet')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(helmet())

var loggedInUsers = [];
var userData = [
  {
    username: "kemal",
    address: "karet semanggi",
    balance: 10000
  },
  {
    username: "user2",
    address: "binus anggrek",
    balance: 0
  },
  {
    username: "hacker",
    address: "dihatimu",
    balance: 0
  }
];

app.get("/halo", (req, res) => {
  res.send("Hello world!");
});

// log setiap request yang masuk
// app.use((req, res, next) => {
//   console.log("Incoming request");
//   console.log(req.headers);
//   console.log(req.body);
//   next();
// });

app.get("/userdata", (req, res) => {
  // cek apakah token ada di list loggedInUsers
  var loggedIn = false;
  loggedInUsers.forEach(loggedInUser => {
    if (req.cookies.token == loggedInUser.token) {
      loggedIn = true;
      var userDataQuery = userData.filter(
        filteredUser => filteredUser.username == loggedInUser.username
      );
      res.send(userDataQuery[0]);
    }
  });
  if (!loggedIn) res.send("Not logged in");
});

app.post("/login", (req, res) => {
  if (
    (req.body.username == "kemal" && req.body.password == "kemal") ||
    (req.body.username == "user2" && req.body.password == "user2") ||
    (req.body.username == "hacker" && req.body.password == "hacker")
  ) {
    var uniqueToken = Math.random()
      .toString()
      .substring(2);
    loggedInUsers.push({
      username: req.body.username,
      token: uniqueToken
    });
    console.log(`User: ${req.body.username} is logged in.`);
    console.log(`Lists of users logged in:`, loggedInUsers);
    res.cookie("token", uniqueToken);
    res.redirect("/");
  } else {
    res.send("Invalid login");
  }
});

app.get("/logout", (req, res) => {
  loggedInUsers.forEach((loggedInUser, index) => {
    if (req.cookies.token == loggedInUser.token) {
      loggedInUsers.splice(index, 1);
    }
  });
  res.redirect("/");
});

app.get("/transfer/:tousername/:amount", (req, res) => {
  var transferSuccess = false;
  loggedInUsers.forEach((loggedInUser, index) => {
    // if (req.cookies.token == loggedInUser.token) {
    if (req.cookies.token == loggedInUser.token) {
      userData.filter(
        user => user.username == loggedInUser.username
      )[0].balance -= parseInt(req.params.amount);

      userData.filter(
        user => user.username == req.params.tousername
      )[0].balance += parseInt(req.params.amount);

      transferSuccess = true;
      console.log(
        `${loggedInUser.username} transferred ${req.params.amount} to ${req
          .params.tousername}`
      );
      console.log("Current user data: \n", userData);
      res.send("transfer success");
    }
  });
  if (!transferSuccess) res.send("transfer failed");
});

app.use(express.static(__dirname + "/views"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Open http://localhost:" + port);
});
