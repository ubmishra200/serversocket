const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

const bodyparse = require("body-parser");
const Chat = require("./model/chat.model");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
app.use(cors());

app.use(bodyparse.urlencoded({ extended: false }));
app.use(bodyparse.json());

const mongodb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ubmishra200:datingapp@cluster0.wwmhbis.mongodb.net/"
    );
    console.log("mongodb is start");
  } catch (error) {
    console.log(error);
  }
};
mongodb();

io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      //emit the message to the receiver
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Error handling the messages");
    }
    socket.on("disconnet", () => {
      console.log("user disconnected");
    });
  });
});

http.listen(8000, () => {
  console.log("Socket.IO server running on port 8000");
});
