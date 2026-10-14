import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import { createAcesstoken, createRefreshtoken, readRefreshToken } from "../utils/auth.utils.js"


/*
* @description ; register an user and save the data from req.body

param req express.request
param req.body object
param req.body.email string
param req.body.name

*/

export async function register(req, res) {
    const { email, name, password } = req.body

    const isUseralreadyExist = await userModel.findOne({
        email
    })

    if (isUseralreadyExist) {
        return res.status(400).json({
            message: "user already exists",
            errors: [
                {
                    field: "email",
                    message: "user alreadt exist with same email "
                }
            ]
        })
    }

    const user = await userModel.create({
        email,
        name,
        passwordHash: await bcrypt.hash(password, 12)
    });

    const accesstoken = createAcesstoken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshtoken({
        userId: user._id,
        role: user.role
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })
    await userModel.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken
    })

    res.status(201).json({
        message: "user register successdully",
        data: {
            user: {
                email: user.email,
                name: user.name,
                id: user._id
            },
            accesstoken
        }
    })


}


export async function login(req, res) {
    try { // used try catch function 
        const { email, password } = req.body;//body se data aaya 

        const user = await userModel.findOne({ email }); //database se find kiya 

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPassValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPassValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = createAcesstoken({
            userId: user._id,
            role: user.role
        });

        const refreshToken = createRefreshtoken({
            userId: user._id,
            role: user.role
        });

        await userModel.findByIdAndUpdate(user._id, {
            refreshToken
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true
        });

        return res.status(200).json({
            message: "User logged in successfully",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                accessToken
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "refresh token is expired"
        })
    }

    // now here we have to read data of refresh token so it have to be decoded 
    //this function is created in utils
    try {
        const decoded = readRefreshToken(refreshToken)

        // yaha vahi data milega jo refreshoken create karte time use kiya tha user and role
        const { userId, role } = decoded


        //find and check
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (refreshToken !== user.refreshToken) {
            return res.status(401).json({
                message: "Refresh token mismatch"
            });
        }

        // if both matches 
        const accessToken = createAcesstoken({
            userId, role
        })

        const newRefreshToken = createRefreshtoken({
            userId, role

        })

        await userModel.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true
        })

        res.status(200).json({
            message: "token rotated done",
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                    id: user._id,
                },
                accessToken
            }
        })

    } catch (error) {
        return res.status(401).json({
            message: "invalid refresh token "
        })
    }
}

export async function getMe(req,res){
    const {userId , role } = req.user
    const user = await userModel.findById(userId)

    res.status(200).json({
        message:"user data fetch successfully",
        data:
        {
            user:{
                email:user.email,
                name:user.name,
                id:user._id
            }
        }
    })
}
