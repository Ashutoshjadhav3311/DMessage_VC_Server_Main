const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//let connectedUsers = {};

io.on("connection", socket => {
  //let userName = socket.handshake.query.name; // Get the user's name from the client
  // Add the user to the connected users object
  // connectedUsers[socket.id] = userName;

  //socket.emit("connectedUsers", connectedUsers);
  // Send the connected users list to the client
  //socket.on("disconnect", () => {
  //  socket.broadcast.emit("callEnded");
  //  delete connectedUsers[socket.id]; // Remove the user from the connected users object
  // });

  socket.on("me", () => {
    socket.emit("me", socket.id);
  });
  //socket.on("");
  //socket.emit("me", socket.id);

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
