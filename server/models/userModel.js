const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        min: 3,
        max: 20,
        unique : true,
    },
    email:{
        type: String,
        required : true,
        max: 20,
        unique : true,
    },
    password:{
        type: String,
        required : true,
        max:8,
    },
    isAvatarImageSet:{
        type: Boolean,
        default : false,
    },
    avatarImage:{
        type:String,
        default: ""
    }
})

const userModal = mongoose.model("User", userSchema);
module.exports = userModal