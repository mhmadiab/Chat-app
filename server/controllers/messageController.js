const Message = require("../models/messageModel")

const addMessage = async(req, res, next)=>{
    try {
        const {from, to , message} = req.body
        const data = await Message.create({
            message : {text : message},
            users : [from , to],
            sender : from
        })
        if(data)
            return res.status(200).json({message : "message added successfully" , data : null})
        return res.status(400).json({message : "failed to add message" , data : null})
    } catch (error) {
        next(error)
    }
}

const getAllMessages = async(req, res, next)=>{
  try {
    const {from , to} = req.body
    const messages = await Message.find({
        users : {
           $all : [from , to]
        },
    }).sort({updatedAt : 1})
    const projectedMessages = messages.map((message)=>{
        return {
            fromSelf : message.sender.toString() === from,
            message : message.message.text.toString()
        }
    })
    return res.status(200).json(projectedMessages)
  } catch (error) {
    next(error)
  }
}

module.exports = {
    addMessage,
    getAllMessages
}