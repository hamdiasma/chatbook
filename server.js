require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParse = require("cookie-parser");
const path = require("path");
const SocketServer = require("./socketServer");
const { ExpressPeerServer } = require("peer");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParse());

// socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const user = [];
io.on("connection", (socket) => {
  SocketServer(socket);
});

// create PeerServer
// PeerServer({ port: 3001, path: "/" });

ExpressPeerServer(http, { path: "/" });

// app.get("/", (req, res) => {
//   res.send({ msg: "hello social" });
// });

const db = process.env.MONGO_URI;

mongoose.connect(
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDb connected...");
  }
);

// routes

app.use("/api", require("./server/routers/authRouters"));
app.use("/api", require("./server/routers/usersRouter"));
app.use("/api", require("./server/routers/postRouter"));
app.use("/api", require("./server/routers/commentRouter"));
app.use("/api", require("./server/routers/notifyRouter"));
app.use("/api", require("./server/routers/messageRuter"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log("server running in port", PORT));
