const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const sockets = require("socket.io");
const http = require("http");

const app = express();


// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);


const PORT = process.env.PORT || 8555;


const server = app.listen(PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
  );

// Socket.IO Configuration
const io = sockets(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true, 
    },
})

global.onlineUsers = new Map()

io.on("connection", (socket) => {
    global.chatSocket = socket

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    });

    // socket.on("disconnect" , ()=>{
    //     onlineUsers.forEach((socketId, userId) => {
    //          if(socketId === socket.id){
    //             onlineUsers.delete(userId)
    //             socket.broadcast.emit("user-status", { userId, status: "offline" })
    //          }
    //     })
    // })

    
    socket.on("send-message", (data) => {
        const sendUserSocket = onlineUsers.get(data.to); // find the target user socket.id through received data
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("message-recieved", data.message)
        }
    });

    socket.on("typing", ({from , to})=>{
        const receiverSocketId = onlineUsers.get(to)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("typing" , {from})
        }
    })

    socket.on("stop-typing", ({ from, to }) => {
        const receiverSocketId = onlineUsers.get(to)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stop-typing", { from })
        }
    })

    
})


