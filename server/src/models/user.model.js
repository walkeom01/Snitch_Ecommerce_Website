import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true,
    },
    role:{
        //seller or user
        type:String,
        default:"user",
        enum:["user","seller"] //possible values that role can have 
    }
})

const userModel = mongoose.model("users",userSchema)

export default userModel