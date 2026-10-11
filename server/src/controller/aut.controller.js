import userModel from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { createAcesstoken , createRefreshtoken } from "../utils/auth.utils.js"


/*
* @description ; register an user and save the data from req.body

param req express.request
param req.body object
param req.body.email string
param req.body.name

*/

export async function register(req,res) {
    const {email , name ,password} = req.body

    const isUseralreadyExist = await userModel.findOne({
        email
    })

    if(isUseralreadyExist){
        return res.status(400).json({
            message:"user already exists",
            errors:[
                {
                    field:"email",
                    message:"user alreadt exist with same email "
                }
            ]
        })
    }

    const user = await userModel.create({
        email,
        name,
        passwordHash : await bcryptjs.hash(password,12)
    })

    const accesstoken = createAcesstoken({
        userId:user._id,
        role:user.role
    })
    
    const refreshToken = createRefreshtoken({
        userId:user._id,
        role:user.role
    })


}

