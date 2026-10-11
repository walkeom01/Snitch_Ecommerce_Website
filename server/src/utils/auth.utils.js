import config from "../config/config";
import jwt from "jsonwebtoken"


export function createAcesstoken({userId,role}){
    const accessToken = jwt.sign({
        userId,role
    },config.ACCESS_TOKEN,{expiresIn:"15M"})

    return accessToken
}

export function createRefreshtoken({userId , role}){
    const refreshToken = jwt.sign({
        userId,role
    },config.REFRESH_TOKEN,{expiresIn:"7Days"})

    return refreshToken
}