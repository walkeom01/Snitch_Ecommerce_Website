import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import { createAcesstoken , createRefreshtoken , readRefreshToken} from "../utils/auth.utils.js"


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

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true
    })
    await userModel.findByIdAndUpdate(user._id,{
        refreshToken:refreshToken
    })

    res.status(201).json({
        message:"user register successdully",
        data:{
            user:{
                email:user.email,
                name:user.name,
                id:user._id
            },
            accesstoken
        }
    })


}

export async function login(req,res){
    const {email , password} = req.body

    const user = await userModel.findOne({
        email
    })
    // we send error that invalid credentials because attacker should not know that the pass is incorrect or email 

    if(!user){
        return res.status(400).json({
            message:"invalid credentials"
        })
    }

    const ispassValid = bcrypt.compare(password , user.passwordHash)

    if(!ispassValid){
        return res.status(400).json({
            message:"invalid email or password"
        })
    }

    //if email and pass is correct then we have to login user and create new access and refresh token 

    const accessToken = createAcesstoken({
        userId:user._id,
        role:user.role
    })

    const refreshToken = createRefreshtoken({
        userId:user._id,
        role:user.role
    })

    /// now we have to update in database 

    await userModel.findOneAndUpdate({
        email
    },{
        refreshToken
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true
    })

    res.status(200).json({
        message:"user loggedin successfully",
        data:{
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            }
        }
    })

}

export async function refresh(req,res){
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            message:"refresh token is expired"
        })
    }

    // now here we have to read data of refresh token so it have to be decoded 
    //this function is created in utils
    try {
        const decoded = readRefreshToken(refreshToken)

        // yaha vahi data milega jo refreshoken create karte time use kiya tha user and role
        const {userId,role} = decoded

        const user = await userModel.findById(userId)

        if(refreshToken != user.resfreshToken){
            await userModel.findByIdAndUpdate(user._id,{
                refreshToken:null
            })
            return res.status(401).json({
              message:"refresh token mismatch"  
            })
        }

    } catch (error) {
        return res.status(401).json({
            message:"invalid refresh token "
        })
    }
}

