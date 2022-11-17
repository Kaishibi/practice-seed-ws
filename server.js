const socketIO = require("socket.io");
const express = require("express");
const fetch = require("node-fetch");

const PORT = process.env.PORT || 3001;
const server = express()
  .use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  .listen(PORT, () => console.log("Listening..."));
const io = socketIO(server);

const checkUUID = (uuid) => {
  const reg = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return reg.test(uuid);
}

io.on("connection", s => {
  s.on("play", msg => {
    if (msg.length == 2 || msg.length == 3) {
      if (checkUUID(msg[0])) {
        s.broadcast.emit("play-seed", msg);
      }
    }
  });
  s.on("race", msg => {
    if (msg.length == 2) {
      s.broadcast.emit("race-seed", msg);
    }
  });
});

setInterval(() => fetch("https://salty-wave-05504.herokuapp.com/"), 250000)
