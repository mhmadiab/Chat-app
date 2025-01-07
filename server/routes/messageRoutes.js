const express = require("express")
const {getAllMessages, addMessage} = require("../controllers/messageController")
const messageRoute = express.Router()


messageRoute.post("/getmessages/" , getAllMessages)
messageRoute.post("/addmessage/" ,addMessage)


module.exports = messageRoute