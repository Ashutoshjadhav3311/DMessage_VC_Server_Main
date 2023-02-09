const express = require("express");
const https = require("https");
const app = express();
const server = https.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", //for cloud https://dmessagevc.onrender.com/ for local http://localhost:3000
    methods: ["GET", "POST"],
  },
});
var usernames = {};
let connectedUsers = {};
const users = [];
const nameId = [];
io.on("connection", socket => {
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  socket.emit("users", users);
  //runs whenever any client connects
  socket.on("adduser", data => {
    // we store the username in the socket session for this client
    socket.username = data;

    connectedUsers.username = data;
    console.log(socket.username);
    // console.log(users);
  });
  socket.on("username_userId", function (data) {
    nameId.push({
      userID: data.id,
      username: data.username,
    });
    console.log(nameId);
    io.emit("userlist", nameId);
    // io.emit("userlist", { nameId });
  });

  // io.emit("userlist", { nameId });

  socket.on("me", () => {
    socket.emit("me", socket.id);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", data => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", data => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(5000, () => console.log("server is running on port 5000"));
