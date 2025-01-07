const express = require("express")
const {registerUser , loginUser, setAvatar, getAllUsers} = require("../controllers/userController")

const userRoutes = express.Router()

//registerUser: 
userRoutes.post("/register", registerUser)
userRoutes.post("/login" , loginUser)
userRoutes.post("/setavatar/:id" , setAvatar)
userRoutes.get("/allusers/:id", getAllUsers)

module.exports = userRoutes