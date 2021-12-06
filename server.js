const express = require("express");
const socket = require("socket.io");

// to initialize the app with server
const app = express();
app.use(express.static("client"));

let port = 3000;
let server = app.listen(port, () => {
  console.log("Listening to " + port + " port");
});

let io = socket(server);
io.on("connection", (socket) => {
  console.log("New Device connected");

  socket.on("tracePath", (data) => {
    //data -> front-end data
    // transfering received to all connected components
    io.sockets.emit("tracePath", data);
  });

  socket.on("fillPath", (data) => {
    io.sockets.emit("fillPath", data);
  });

  socket.on("undoRedo", (data) => {
    io.sockets.emit("undoRedo", data);
  });
  
});
