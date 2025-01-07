
const User = require("../models/userModel")
const bcrypt = require("bcrypt")

const registerUser = async (req, res, next) => {
    try {
        const {username , email, password} = req.body

        //check if username and email are used before:
        const checkUsername = await User.findOne({username})
        if(checkUsername)
            return res.status(409).json({message : "username already used." , data : null})

        const checkEmail = await User.findOne({email})
        if(checkEmail)
            return res.status(409).json({message : "email already used." , data : null})

        //hashing password:
        const salt = 10
        const hashedPassword = await bcrypt.hash(password, salt)

        //create user: 
        const user = await User.create({
            username, 
            email,
            password : hashedPassword,
        })
        delete user.password
        return res.status(201).json({message: "user registered successfully" , data : user })
    } catch (error) {
        next(error)
    }
};

const loginUser = async(req, res, next)=>{
    try {
        const {username, password} = req.body
        const loggedInUser = await User.findOne({username})

        if(!loggedInUser)
            return res.status(409).json({message: "Incorrect username or password" , data : null})

        const isPasswordValid = await bcrypt.compare(password, loggedInUser.password)
        if(!isPasswordValid)
            return res.status(409).json({message: "Incorrect username or password" , data : null}) 
        return res.status(200).json({message : "user loggedin successfully" , data : loggedInUser})
    } catch (error) {
        next(error)
    }
}

const setAvatar = async ( req, res, next)=>{
    try {
        const userId = req.params.id
        const avatarImage = req.body.image
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet : true,
            avatarImage, 
        }) 
        return res.status(200).json({
            isSet : userData.isAvatarImageSet,
            image : userData.avatarImage
        })
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async(req, res, next)=>{
    try {
        //select all contact for the user and not including him in the list 
        const users = await User.find({ _id : { $ne : req.params.id}}).select([
            "email", "username", "avatarImage", "_id"
        ])
        return res.status(200).json({message : "users found" , data : users})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    setAvatar,
    getAllUsers
}