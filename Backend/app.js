const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// socket
const http = require("http");
const { Server } = require("socket.io");
const userStatusHandler = require("./socket/userStatus");
const { setIO } = require("./socket/io");

//routes
const authRoutes = require("./routes/authRoutes");
const drawRoomRoutes = require("./routes/drawRoomRoutes");
const userRoutes = require("./routes/userRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// expose io for controllers
setIO(io);
userStatusHandler(io);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/drawroom", drawRoomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
