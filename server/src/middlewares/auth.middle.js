import { readAcessToken } from "../utils/auth.utils.js"

/**
 * authentication ka rule hai accesstoken ko headers se hi read kiya jayega 
 * aur kahi se nahi agar cookies me send karenge then it will not accept 
 * 
 */
export function authenticate (req,res,next){
    const accessToken = req.headers.authorization?.split(" ")[1]

    if(!accessToken){
        return res.status(400).json({
            message:"access token not found in request headers"
        })
    }

    try {
        const decoded = readAcessToken(accessToken)

       // const{userId , role} = decoded
        req.user = decoded // yaha user name se property create kr  rahe hai and assinging value of decoded

        next()
        
    } catch (error) {
        res.status(401).json({
            message:"invalid or expired access token "
        })
    }
}